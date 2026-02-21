import * as React from 'react';
import { render, screen } from '@testing-library/react';
import Error from '@/app/error';

// Mock next/image to avoid actual image loading requirements and simplify assertions
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt || 'mocked image'} />;
    },
}));

// Mock next/link to behave like a standard anchor tag in the JSDOM test env
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode, href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

describe('Error Page Component', () => {
    it('renders correctly', () => {
        render(<Error />);

        expect(screen.getByText('Something went wrong!')).toBeInTheDocument();

        // Verify both light and dark mode images render
        const images = screen.getAllByAltText('error');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', '/error.svg');
        expect(images[1]).toHaveAttribute('src', '/error-dark.svg');

        // Verify "Go back" link
        const link = screen.getByRole('link', { name: /go back/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/documents');
    });
});
