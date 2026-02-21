import * as React from 'react';
import { render, screen } from '@testing-library/react';
import MainLayout from '@/app/(main)/layout';
import { useConvexAuth } from 'convex/react';

// Mock routing
jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}));

// Mock Convex auth
jest.mock('convex/react', () => ({
    useConvexAuth: jest.fn(),
}));

// Mock coworker config
jest.mock('@/hooks/useCoworkerConfig', () => ({
    useCoworkerConfig: () => ({ isExpanded: false }),
}));

// Mock child components
jest.mock('@/components/spinner', () => ({
    Spinner: () => <div data-testid="mock-spinner">Loading...</div>,
}));

jest.mock('@/app/(main)/_components/Navigation', () => ({
    __esModule: true,
    default: () => <nav data-testid="mock-navigation">Navigation</nav>,
}));

jest.mock('@/components/search-command', () => ({
    SearchCommand: () => <div data-testid="mock-search-command">Search</div>,
}));

jest.mock('@/components/coworker/CoworkerFloatingChat', () => ({
    CoworkerFloatingChat: () => <div data-testid="mock-coworker-chat">Chat</div>,
}));

jest.mock('@/components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-scroll-area">{children}</div>,
}));

describe('MainLayout', () => {
    const mockRedirect = require('next/navigation').redirect;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows spinner when loading', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: true,
            isAuthenticated: false,
        });

        render(<MainLayout><div>Content</div></MainLayout>);

        expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-navigation')).not.toBeInTheDocument();
    });

    it('redirects to home when not authenticated', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: false,
        });

        render(<MainLayout><div>Content</div></MainLayout>);

        expect(mockRedirect).toHaveBeenCalledWith('/');
    });

    it('renders content when authenticated', () => {
        (useConvexAuth as jest.Mock).mockReturnValue({
            isLoading: false,
            isAuthenticated: true,
        });

        render(<MainLayout><div data-testid="child-content">Content</div></MainLayout>);

        expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
        expect(screen.getByTestId('mock-search-command')).toBeInTheDocument();
        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByTestId('mock-coworker-chat')).toBeInTheDocument();
    });
});
