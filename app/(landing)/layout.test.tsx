import * as React from 'react';
import { render, screen } from '@testing-library/react';
import LandingLayout from '@/app/(landing)/layout';

// Mock the Navbar component to avoid its complex dependencies
jest.mock('@/app/(landing)/_components/Navbar', () => ({
    Navbar: () => <nav data-testid="mock-navbar">Navbar</nav>,
}));

describe('LandingLayout', () => {
    it('renders Navbar and children correctly', () => {
        render(
            <LandingLayout>
                <div data-testid="child-content">Landing Page Content</div>
            </LandingLayout>
        );

        // Verify Navbar renders
        expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();

        // Verify children render
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Landing Page Content')).toBeInTheDocument();
    });
});
