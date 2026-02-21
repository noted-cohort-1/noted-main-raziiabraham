import * as React from 'react';
import { render, screen } from '@testing-library/react';
import LandingPage from '@/app/(landing)/page';

// Mock all internal landing page components
jest.mock('@/app/(landing)/_components/footer', () => ({
    Footer: () => <footer data-testid="mock-footer">Footer Content</footer>,
}));

jest.mock('@/app/(landing)/_components/heading', () => ({
    Heading: () => <div data-testid="mock-heading">Heading Content</div>,
}));

jest.mock('@/app/(landing)/_components/heroes', () => ({
    Heroes: () => <div data-testid="mock-heroes">Heroes Content</div>,
}));

jest.mock('@/app/(landing)/_components/features', () => ({
    Features: () => <div data-testid="mock-features">Features Content</div>,
}));

jest.mock('@/app/(landing)/_components/showcase', () => ({
    Showcase: () => <div data-testid="mock-showcase">Showcase Content</div>,
}));

jest.mock('convex/react', () => ({
    useConvexAuth: () => ({ isAuthenticated: false, isLoading: false })
}));

describe('LandingPage', () => {
    it('renders all sections correctly', () => {
        render(<LandingPage />);

        expect(screen.getByTestId('mock-heading')).toBeInTheDocument();
        expect(screen.getByTestId('mock-heroes')).toBeInTheDocument();
        expect(screen.getByTestId('mock-features')).toBeInTheDocument();
        expect(screen.getByTestId('mock-showcase')).toBeInTheDocument();
        expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });
});
