import os
import re
import subprocess

def camel_to_kebab(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s1).lower()

def safe_rename(old_path, new_path):
    if old_path == new_path:
        return
    
    # Git mv for case insensitive file systems
    print(f"Renaming: {old_path} -> {new_path}")
    
    # To bypass macOS case insensitivity issues where `git mv File.ts file.ts` might fail, 
    # we first move it to a temp name, then to the target lowercase name
    temp_path = new_path + ".temp__"
    subprocess.run(['git', 'mv', old_path, temp_path], check=True)
    subprocess.run(['git', 'mv', temp_path, new_path], check=True)

directories = ['components', 'app', 'hooks', 'lib']
rename_map = {}

# 1. Collect all files and determine their new names
for root_dir in directories:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(('.tsx', '.ts')) and not filename.endswith('.d.ts'):
                base_name, ext = os.path.splitext(filename)
                
                # Check if it has naming issues like PascalCase or dot notation (except .test)
                new_base = base_name
                
                # Strip out .test from base for a moment to calculate pure casing
                is_test = new_base.endswith('.test')
                if is_test:
                    new_base = new_base[:-5]
                
                new_base = camel_to_kebab(new_base)
                
                # Handle any straggler dot notations if they exist (name.name2 -> name-name2), except extensions
                new_base = new_base.replace('.', '-')
                
                if is_test:
                    new_base += '.test'
                
                new_filename = new_base + ext
                
                if new_filename != filename:
                    old_path = os.path.join(dirpath, filename)
                    new_path = os.path.join(dirpath, new_filename)
                    rename_map[old_path] = new_path

# 2. Update imports inside all files BEFORE renaming while they still exist
# We need the basename mappings to catch imports
# Example: import { Banner } from "./Banner" -> import { Banner } from "./banner"
# We can just do a big regex replacement for the old filename bases to new filename bases

basename_map = {}
for old, new in rename_map.items():
    old_base = os.path.splitext(os.path.basename(old))[0]
    new_base = os.path.splitext(os.path.basename(new))[0]
    # Only map if it actually changed
    if old_base != new_base:
        basename_map[old_base] = new_base

# Add 'AgentSlashCommand' to mapping manually to be sure
# Actually, iterating through all files and doing regex sub on imports is safer.

import_pattern = re.compile(r'(from\s+["\'])(.*?)(["\'])')
dynamic_import_pattern = re.compile(r'(import\s*\(\s*["\'])(.*?)(["\']\s*\))')

def update_path(match):
    prefix = match.group(1)
    import_path = match.group(2)
    suffix = match.group(3)
    
    # We only care about local paths
    if import_path.startswith('.') or import_path.startswith('@/'):
        path_parts = import_path.split('/')
        last_part = path_parts[-1]
        
        # if the last part is in our basename map, switch it
        if last_part in basename_map:
            path_parts[-1] = basename_map[last_part]
            import_path = '/'.join(path_parts)
            
    return prefix + import_path + suffix

for dirpath, dirnames, filenames in os.walk('.'):
    if 'node_modules' in dirpath or '.git' in dirpath or '.next' in dirpath:
        continue
    for filename in filenames:
        if filename.endswith(('.tsx', '.ts', '.js', '.jsx')):
            file_path = os.path.join(dirpath, filename)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            new_content = import_pattern.sub(update_path, content)
            new_content = dynamic_import_pattern.sub(update_path, new_content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

# 3. Rename the files using git mv
for old_path, new_path in rename_map.items():
    safe_rename(old_path, new_path)

print("Renaming complete.")
