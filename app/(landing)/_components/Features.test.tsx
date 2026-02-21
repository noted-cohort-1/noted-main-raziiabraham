import React from 'react';
import { render, screen } from '@testing-library/react';
import { Features } from '@/app/(landing)/_components/Features';

describe('Features Component', () => {
    it('renders correctly', () => {
        render(<Features />);

        // Check if the titles are present
        expect(screen.getByText('Write and organize')).toBeInTheDocument();
        expect(screen.getByText('Write faster with AI')).toBeInTheDocument();
        expect(screen.getByText('Find anything instantly')).toBeInTheDocument();
        expect(screen.getByText('Share with the world')).toBeInTheDocument();

        // Check if some highlights are present
        expect(screen.getByText('Block-based editor')).toBeInTheDocument();
        expect(screen.getByText('BYOK (OpenAI)')).toBeInTheDocument();
        expect(screen.getByText('⌘K shortcut')).toBeInTheDocument();
        expect(screen.getByText('Public pages')).toBeInTheDocument();

        // Check for "Learn more" links
        const links = screen.getAllByRole('link', { name: /learn more/i });
        expect(links).toHaveLength(4);
    });
});
