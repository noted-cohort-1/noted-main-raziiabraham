import { cn } from './utils';

describe('cn function', () => {
    it('merges tailwind classes using clsx and tailwind-merge', () => {
        // Basic test
        expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');

        // Conditional test (clsx behavior)
        expect(cn('bg-red-500', true && 'text-white', false && 'p-4')).toBe('bg-red-500 text-white');

        // Merge conflicting tailwind classes (tailwind-merge behavior)
        expect(cn('p-4 px-2', 'p-8')).toBe('p-8');
        expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });
});
