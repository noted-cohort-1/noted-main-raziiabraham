import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navigation from '@/app/(main)/_components/Navigation';
import { useMediaQuery } from 'usehooks-ts';
import { useMutation, useQuery } from 'convex/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import { useSettings } from '@/hooks/useSettings';
import { useCoworkerConfig } from '@/hooks/useCoworkerConfig';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('usehooks-ts', () => ({
    useMediaQuery: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('@/hooks/useSearch', () => ({
    useSearch: jest.fn(),
}));

jest.mock('@/hooks/useSettings', () => ({
    useSettings: jest.fn(),
}));

jest.mock('@/hooks/useCoworkerConfig', () => ({
    useCoworkerConfig: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: { promise: jest.fn() },
}));

jest.mock('@/app/(main)/_components/DocumentList', () => ({
    DocumentList: () => <div data-testid="document-list">Document List</div>,
}));

jest.mock('@/app/(main)/_components/UserItem', () => ({
    UserItem: () => <div data-testid="user-item">User Item</div>,
}));

jest.mock('@/app/(main)/_components/Navbar', () => ({
    Navbar: () => <div data-testid="navbar">Navbar</div>,
}));

jest.mock('@/app/(main)/_components/TrashBox', () => ({
    TrashBox: () => <div data-testid="trash-box">Trash Box</div>,
}));

jest.mock('@/app/(main)/_components/Item', () => ({
    Item: ({ label, onClick }: any) => (
        <div data-testid={`item-${label}`} onClick={onClick}>{label}</div>
    ),
}));

// Mock API route
jest.mock('@/convex/_generated/api', () => ({
    api: {
        documents: {
            create: 'mock-create'
        },
        squadAgents: {
            list: 'mock-agents-list'
        }
    }
}));

describe('Navigation', () => {
    const mockRouterPush = jest.fn();
    const mockSearchOpen = jest.fn();
    const mockSettingsOpen = jest.fn();
    const mockCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });
        (usePathname as jest.Mock).mockReturnValue('/documents');
        (useParams as jest.Mock).mockReturnValue({});

        (useMediaQuery as jest.Mock).mockReturnValue(false); // Desktop by default

        (useCoworkerConfig as unknown as jest.Mock).mockReturnValue({
            isExpanded: false,
            sidebarWidth: 350,
            isResizing: false,
        });

        (useSearch as unknown as jest.Mock).mockReturnValue({
            onOpen: mockSearchOpen,
        });

        (useSettings as unknown as jest.Mock).mockReturnValue({
            onOpen: mockSettingsOpen,
        });

        (useMutation as jest.Mock).mockReturnValue(mockCreate);
        (useQuery as jest.Mock).mockImplementation((spec) => {
            if (spec === 'mock-agents-list') {
                return [{ _id: '1', name: 'Agent 1', instructionsDocId: 'doc1' }];
            }
            return null;
        });

        mockCreate.mockResolvedValue('new-doc-id');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders navigation bar correctly on desktop', () => {
        render(<Navigation />);
        expect(screen.getByTestId('user-item')).toBeInTheDocument();
        expect(screen.getByTestId('document-list')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
        expect(screen.getByText('New page')).toBeInTheDocument();
        expect(screen.getByText('Agent 1')).toBeInTheDocument();
    });

    it('opens search when search menu button is clicked', () => {
        render(<Navigation />);
        fireEvent.click(screen.getByText('Search'));
        expect(mockSearchOpen).toHaveBeenCalled();
    });

    it('opens settings when settings menu button is clicked', () => {
        render(<Navigation />);
        fireEvent.click(screen.getByText('Settings'));
        expect(mockSettingsOpen).toHaveBeenCalled();
    });

    it('navigates to proper route on menu clicks', () => {
        render(<Navigation />);
        fireEvent.click(screen.getByText('Files'));
        expect(mockRouterPush).toHaveBeenCalledWith('/files');

        fireEvent.click(screen.getByText('AI Squad'));
        expect(mockRouterPush).toHaveBeenCalledWith('/coworkers');

        fireEvent.click(screen.getByText('Agent 1'));
        expect(mockRouterPush).toHaveBeenCalledWith('/documents/doc1');
    });

    it('collapses on mobile', () => {
        (useMediaQuery as jest.Mock).mockReturnValue(true); // Mobile
        const { container } = render(<Navigation />);

        // Sidebar should have width 0 when collapsed.
        const sidebar = container.querySelector('aside');
        expect(sidebar).toHaveClass('w-0');
    });

    it('creates new document when handling create action', async () => {
        render(<Navigation />);
        fireEvent.click(screen.getByText('New page'));

        expect(mockCreate).toHaveBeenCalledWith({ title: 'Untitled' });

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/documents/new-doc-id');
            expect(toast.promise).toHaveBeenCalled();
        });
    });

    it('renders Navbar when documentId exists', () => {
        (useParams as jest.Mock).mockReturnValue({ documentId: 'doc-123' });
        render(<Navigation />);
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });
});
