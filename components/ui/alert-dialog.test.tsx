import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from '@/components/ui/alert-dialog';

describe('AlertDialog Component', () => {
    it('renders and opens/closes correctly', async () => {
        const user = userEvent.setup();

        render(
            <AlertDialog>
                <AlertDialogTrigger>Delete</AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );

        // Initial state: dialog content should not be visible
        expect(screen.queryByText('Are you absolutely sure?')).not.toBeInTheDocument();

        // Click trigger to open
        await user.click(screen.getByRole('button', { name: "Delete" }));

        // Content should now be visible
        expect(await screen.findByText('Are you absolutely sure?')).toBeInTheDocument();
        expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();

        const cancelButton = screen.getByRole('button', { name: "Cancel" });
        const continueButton = screen.getByRole('button', { name: "Continue" });

        expect(cancelButton).toBeInTheDocument();
        expect(continueButton).toBeInTheDocument();

        // Click cancel to close
        await user.click(cancelButton);

        // Wait for it to close
        await waitFor(() => {
            expect(screen.queryByText('Are you absolutely sure?')).not.toBeInTheDocument();
        });
    });
});
