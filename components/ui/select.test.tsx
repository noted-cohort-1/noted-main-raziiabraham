import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
} from '@/components/ui/select';

// Note: Radix UI sometimes has issues with jsdom environment due to ResizeObserver or PointerEvents
// We mock it here globally for these tests
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};
class MockPointerEvent extends Event {
    button: number;
    ctrlKey: boolean;
    pointerType: string;

    constructor(type: string, props: PointerEventInit) {
        super(type, props);
        this.button = props.button || 0;
        this.ctrlKey = props.ctrlKey || false;
        this.pointerType = props.pointerType || 'mouse';
    }
}
window.PointerEvent = MockPointerEvent as any;
global.PointerEvent = MockPointerEvent as any;

// Radix Select needs these DOM methods
if (typeof Element !== 'undefined') {
    Element.prototype.hasPointerCapture = jest.fn();
    Element.prototype.releasePointerCapture = jest.fn();
    Element.prototype.setPointerCapture = jest.fn();
    Element.prototype.scrollIntoView = jest.fn();
}

describe('Select Component', () => {
    it('renders, opens, and selects a value correctly', async () => {
        const user = userEvent.setup();
        const handleValueChange = jest.fn();

        render(
            <Select onValueChange={handleValueChange}>
                <SelectTrigger aria-label="Theme">
                    <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Themes</SelectLabel>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                    </SelectGroup>
                    <SelectSeparator />
                    <SelectGroup>
                        <SelectLabel>Beta</SelectLabel>
                        <SelectItem value="high-contrast" disabled>High Contrast</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );

        // Initial state: trigger is visible, content is not
        const trigger = screen.getByRole('combobox', { name: 'Theme' });
        expect(trigger).toBeInTheDocument();
        expect(screen.getByText('Select a theme')).toBeInTheDocument();
        expect(screen.queryByText('Themes')).not.toBeInTheDocument();

        // Open select using userEvent
        await user.click(trigger);

        // Wait for the select content to appear
        await waitFor(() => {
            // Radix Select uses listbox pattern
            expect(screen.getByRole('listbox')).toBeInTheDocument();
        });

        // Content should now be visible
        expect(screen.getByText('Themes')).toBeInTheDocument();
        expect(screen.getByText('Light')).toBeInTheDocument();
        expect(screen.getByText('Dark')).toBeInTheDocument();
        expect(screen.getByText('System')).toBeInTheDocument();

        // Check disabled item
        const disabledItem = screen.getByRole('option', { name: /High Contrast/i });
        expect(disabledItem).toHaveAttribute('data-disabled');

        // Click an item to select
        await user.click(screen.getByText('Dark'));

        // Should call the handler
        expect(handleValueChange).toHaveBeenCalledWith('dark');
    });
});
