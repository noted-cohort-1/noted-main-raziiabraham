import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@/components/ui/popover';

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

describe('Popover Component', () => {
    it('renders and opens correctly', async () => {
        const user = userEvent.setup();

        render(
            <Popover>
                <PopoverTrigger>Open Popover</PopoverTrigger>
                <PopoverContent>
                    <div data-testid="popover-content">This is inside the popover</div>
                </PopoverContent>
            </Popover>
        );

        // Initial state: popover content should not be visible
        expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

        // Click trigger to open using userEvent which handles Radix pointer events
        await user.click(screen.getByRole('button', { name: "Open Popover" }));

        // Wait for the popover to open and become visible
        await waitFor(() => {
            expect(screen.getByTestId('popover-content')).toBeInTheDocument();
        });

        // Content should now be visible
        expect(screen.getByText('This is inside the popover')).toBeInTheDocument();
    });
});
