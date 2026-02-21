import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

describe('DropdownMenu Component', () => {
    it('renders and opens correctly', async () => {
        const user = userEvent.setup();
        render(
            <DropdownMenu>
                <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem disabled>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );

        // Initial state: dropdown content should not be visible
        expect(screen.queryByText('My Account')).not.toBeInTheDocument();

        // Click trigger to open using userEvent which fires the correct pointer events for Radix
        await user.click(screen.getByRole('button', { name: "Open Menu" }));

        // Wait for the dropdown to open and become visible
        await waitFor(() => {
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });

        // Content should now be visible
        expect(screen.getByText('My Account')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Billing')).toBeInTheDocument();
        expect(screen.getByText('Team')).toBeInTheDocument();

        // Check for disabled item
        const disabledItem = screen.getByText('Subscription');
        expect(disabledItem).toBeInTheDocument();
        expect(disabledItem).toHaveAttribute('data-disabled');
    });
});
