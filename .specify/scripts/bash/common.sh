#!/usr/bin/env bash
# Common functions and variables for all Speckit scripts in noted-main.
#
# Branch naming convention: {type}/NOT-XXXX-short-name (or lowercase not-XXXX)
# Types: feature, hotfix, bugfix, explore
# Specs directory: specs/NOT-XXXX-short-name/ (no type prefix, uppercase NOT)
# Explore mode: explore/EXP-N-short-name (no Linear ticket required)
# Note: Linear may generate lowercase branch names (e.g., feature/not-1849-...)
#       All matching is case-insensitive for the NOT prefix.

# Get repository root, with fallback for non-git repositories
get_repo_root() {
    if git rev-parse --show-toplevel >/dev/null 2>&1; then
        git rev-parse --show-toplevel
    else
        local script_dir="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
        (cd "$script_dir/../../.." && pwd)
    fi
}

# Strip the branch type prefix (feature/, hotfix/, bugfix/, explore/) to get the spec directory name
# e.g., "feature/NOT-1234-presence" -> "NOT-1234-presence"
strip_branch_type_prefix() {
    local branch="$1"
    echo "$branch" | sed -E 's#^(feature|hotfix|bugfix|explore)/##'
}

# Normalize a ticket ID to uppercase NOT-XXXX format
normalize_ticket_id() {
    local id="$1"
    echo "$id" | tr '[:lower:]' '[:upper:]'
}

# Extract the Linear ticket ID from a branch or directory name (case-insensitive)
# e.g., "feature/NOT-1234-presence" -> "NOT-1234"
# Always returns uppercase NOT-XXXX or empty string
extract_ticket_id() {
    local name="$1"
    local stripped
    stripped=$(strip_branch_type_prefix "$name")
    local ticket
    ticket=$(echo "$stripped" | grep -oiE '^not-[0-9]+' | head -1)
    if [ -n "$ticket" ]; then
        normalize_ticket_id "$ticket"
    else
        echo ""
    fi
}

# Extract the explore ID from a branch or directory name
# e.g., "explore/EXP-3-dark-mode" -> "EXP-3"
extract_explore_id() {
    local name="$1"
    local stripped
    stripped=$(strip_branch_type_prefix "$name")
    local explore_id
    explore_id=$(echo "$stripped" | grep -oE '^EXP-[0-9]+' | head -1)
    echo "$explore_id"
}

is_explore_branch() {
    local name="$1"
    local explore_id
    explore_id=$(extract_explore_id "$name")
    [ -n "$explore_id" ]
}

# Get current branch, with fallback for non-git repositories
get_current_branch() {
    if [[ -n "${SPECIFY_FEATURE:-}" ]]; then
        echo "$SPECIFY_FEATURE"
        return
    fi

    if git rev-parse --abbrev-ref HEAD >/dev/null 2>&1; then
        git rev-parse --abbrev-ref HEAD
        return
    fi

    local repo_root=$(get_repo_root)
    local specs_dir="$repo_root/specs"

    if [[ -d "$specs_dir" ]]; then
        local latest_feature=""
        local latest_mtime=0

        for dir in "$specs_dir"/*; do
            if [[ -d "$dir" ]]; then
                local dirname=$(basename "$dir")
                if echo "$dirname" | grep -qiE '^(not|EXP)-[0-9]+'; then
                    local mtime
                    mtime=$(stat -f %m "$dir" 2>/dev/null || stat -c %Y "$dir" 2>/dev/null || echo "0")
                    if [[ "$mtime" -gt "$latest_mtime" ]]; then
                        latest_mtime=$mtime
                        latest_feature=$dirname
                    fi
                fi
            fi
        done

        if [[ -n "$latest_feature" ]]; then
            echo "$latest_feature"
            return
        fi
    fi

    echo "main"
}

has_git() {
    git rev-parse --show-toplevel >/dev/null 2>&1
}

check_feature_branch() {
    local branch="$1"
    local has_git_repo="$2"

    if [[ "$has_git_repo" != "true" ]]; then
        echo "[specify] Warning: Git repository not detected; skipped branch validation" >&2
        return 0
    fi

    # Accept ticket-linked branches (NOT-XXXX) and explore branches (EXP-N)
    if echo "$branch" | grep -qiE '^(feature|hotfix|bugfix)/not-[0-9]+'; then
        return 0
    fi
    if echo "$branch" | grep -qE '^explore/EXP-[0-9]+'; then
        return 0
    fi

    echo "ERROR: Not on a valid branch. Current branch: $branch" >&2
    echo "Branches must follow: {feature|hotfix|bugfix}/NOT-XXXX[-short-name] or explore/EXP-N[-short-name]" >&2
    return 1
}

get_feature_dir() { echo "$1/specs/$2"; }

# Find feature directory by ticket ID or explore ID prefix
find_feature_dir_by_prefix() {
    local repo_root="$1"
    local branch_name="$2"
    local specs_dir="$repo_root/specs"

    local stripped
    stripped=$(strip_branch_type_prefix "$branch_name")

    # Check for explore branch first
    local explore_id
    explore_id=$(extract_explore_id "$stripped")

    if [[ -n "$explore_id" ]]; then
        local matches=()
        if [[ -d "$specs_dir" ]]; then
            for dir in "$specs_dir"/*; do
                if [[ -d "$dir" ]]; then
                    local dirname=$(basename "$dir")
                    if [ "$dirname" = "$explore_id" ] || echo "$dirname" | grep -qE "^${explore_id}-"; then
                        matches+=("$dirname")
                    fi
                fi
            done
        fi

        if [[ ${#matches[@]} -eq 1 ]]; then
            echo "$specs_dir/${matches[0]}"
        elif [[ ${#matches[@]} -gt 1 ]]; then
            echo "ERROR: Multiple spec directories found with explore ID '$explore_id': ${matches[*]}" >&2
            echo "$specs_dir/$stripped"
        else
            echo "$specs_dir/$stripped"
        fi
        return
    fi

    local ticket_id
    ticket_id=$(extract_ticket_id "$stripped")

    if [[ -z "$ticket_id" ]]; then
        echo "$specs_dir/$stripped"
        return
    fi

    local ticket_id_lower
    ticket_id_lower=$(echo "$ticket_id" | tr '[:upper:]' '[:lower:]')

    local matches=()
    if [[ -d "$specs_dir" ]]; then
        for dir in "$specs_dir"/*; do
            if [[ -d "$dir" ]]; then
                local dirname=$(basename "$dir")
                local dirname_lower
                dirname_lower=$(echo "$dirname" | tr '[:upper:]' '[:lower:]')
                if [ "$dirname_lower" = "$ticket_id_lower" ] || echo "$dirname_lower" | grep -qE "^${ticket_id_lower}-"; then
                    matches+=("$dirname")
                fi
            fi
        done
    fi

    if [[ ${#matches[@]} -eq 0 ]]; then
        echo "$specs_dir/$stripped"
    elif [[ ${#matches[@]} -eq 1 ]]; then
        echo "$specs_dir/${matches[0]}"
    else
        echo "ERROR: Multiple spec directories found with ticket ID '$ticket_id': ${matches[*]}" >&2
        echo "Please ensure only one spec directory exists per ticket ID." >&2
        echo "$specs_dir/$stripped"
    fi
}

get_feature_paths() {
    local repo_root=$(get_repo_root)
    local current_branch=$(get_current_branch)
    local has_git_repo="false"
    local is_explore="false"

    if has_git; then
        has_git_repo="true"
    fi

    if is_explore_branch "$current_branch"; then
        is_explore="true"
    fi

    local feature_dir=$(find_feature_dir_by_prefix "$repo_root" "$current_branch")

    cat <<EOF
REPO_ROOT='$repo_root'
CURRENT_BRANCH='$current_branch'
HAS_GIT='$has_git_repo'
IS_EXPLORE='$is_explore'
FEATURE_DIR='$feature_dir'
FEATURE_SPEC='$feature_dir/spec.md'
IMPL_PLAN='$feature_dir/plan.md'
TASKS='$feature_dir/tasks.md'
RESEARCH='$feature_dir/research.md'
DATA_MODEL='$feature_dir/data-model.md'
QUICKSTART='$feature_dir/quickstart.md'
CONTRACTS_DIR='$feature_dir/contracts'
EOF
}

check_file() { [[ -f "$1" ]] && echo "  ✓ $2" || echo "  ✗ $2"; }
check_dir() { [[ -d "$1" && -n $(ls -A "$1" 2>/dev/null) ]] && echo "  ✓ $2" || echo "  ✗ $2"; }
