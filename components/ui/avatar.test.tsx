import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

describe('Avatar Component', () => {
    it('renders correctly', () => {
        // We only test that it renders without crashing because AvatarImage relies on 
        // Radix internal logic for image loading states which isn't easily testable in jsdom
        const { container } = render(
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback data-testid="fallback">CN</AvatarFallback>
            </Avatar>
        );

        expect(container).toBeInTheDocument();
    });

    it('renders fallback when explicitly no image provided', () => {
        render(
            <Avatar>
                <AvatarFallback data-testid="fallback">CN</AvatarFallback>
            </Avatar>
        );

        expect(screen.getByTestId('fallback')).toBeInTheDocument();
        expect(screen.getByText('CN')).toBeInTheDocument();
    });
});
