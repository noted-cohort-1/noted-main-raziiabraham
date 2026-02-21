import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';

describe('Dialog Component', () => {
    it('renders and opens correctly', async () => {
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Test Dialog</DialogTitle>
                        <DialogDescription>This is a test description.</DialogDescription>
                    </DialogHeader>
                    <div data-testid="dialog-body">Dialog Content</div>
                    <DialogFooter>
                        <button>Close Button Test</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );

        // Initial state: dialog content should not be visible
        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();

        // Click trigger to open
        fireEvent.click(screen.getByText('Open Dialog'));

        // Wait for the dialog to open and become visible
        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Content should now be visible
        expect(screen.getByText('Test Dialog')).toBeInTheDocument();
        expect(screen.getByText('This is a test description.')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-body')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Close Button Test' })).toBeInTheDocument();
    });
});
