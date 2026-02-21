import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge Component', () => {
    it('renders correctly with default variant', () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText('Default Badge');

        expect(badge).toBeInTheDocument();
        // Default variant has these classes in cva definition
        expect(badge).toHaveClass('border-transparent');
        expect(badge).toHaveClass('bg-primary');
        expect(badge).toHaveClass('text-primary-foreground');
    });

    it('renders correctly with secondary variant', () => {
        render(<Badge variant="secondary">Secondary Badge</Badge>);
        const badge = screen.getByText('Secondary Badge');

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-secondary');
        expect(badge).toHaveClass('text-secondary-foreground');
    });

    it('renders correctly with destructive variant', () => {
        render(<Badge variant="destructive">Destructive Badge</Badge>);
        const badge = screen.getByText('Destructive Badge');

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('bg-destructive');
        expect(badge).toHaveClass('text-destructive-foreground');
    });

    it('renders correctly with outline variant', () => {
        render(<Badge variant="outline">Outline Badge</Badge>);
        const badge = screen.getByText('Outline Badge');

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-foreground');
    });
});
