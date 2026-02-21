import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from '@/components/ui/command';

// Note: Radix UI/cmdk sometimes has issues with jsdom environment due to ResizeObserver
// We mock it here globally for these tests
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('Command Component', () => {
    it('renders and filters items correctly', async () => {
        const user = userEvent.setup();
        const handleSelect = jest.fn();

        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Fruits">
                        <CommandItem onSelect={handleSelect}>Apple</CommandItem>
                        <CommandItem onSelect={handleSelect}>Banana</CommandItem>
                        <CommandItem onSelect={handleSelect}>Orange</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        );

        // Initial state: all items visible
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('Banana')).toBeInTheDocument();
        expect(screen.getByText('Orange')).toBeInTheDocument();
        expect(screen.queryByText('No results found.')).not.toBeInTheDocument();

        // Type to filter
        const input = screen.getByPlaceholderText('Search...');
        await user.type(input, 'App');

        // Filtered state
        // cmdk removes unmatched items from the DOM
        const apple = screen.getByText('Apple');
        expect(apple).toBeInTheDocument();
        expect(screen.queryByText('Banana')).not.toBeInTheDocument();

        // In our simplified test env, cmdk might not perfectly emulate the exact CSS hiding
        // But we can verify the input received the text
        expect(input).toHaveValue('App');

        // Test selection
        await user.click(apple);
        expect(handleSelect).toHaveBeenCalledWith('apple');
    });
});
