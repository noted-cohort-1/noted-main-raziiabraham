import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchCommand } from '@/components/search-command';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';

// Mock dependencies
jest.mock('@clerk/clerk-react', () => ({
    useUser: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useQuery: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock the global search store
jest.mock('@/hooks/useSearch', () => ({
    useSearch: jest.fn(),
}));

// Mock the UI components used by SearchCommand
jest.mock('@/components/ui/command', () => ({
    CommandDialog: ({ children, open, onOpenChange }: any) => (open ? <div data-testid="command-dialog" onClick={() => onOpenChange(false)}>{children}</div> : null),
    CommandInput: ({ placeholder }: any) => <input data-testid="command-input" placeholder={placeholder} />,
    CommandList: ({ children }: any) => <div data-testid="command-list">{children}</div>,
    CommandEmpty: ({ children }: any) => <div data-testid="command-empty">{children}</div>,
    CommandGroup: ({ children, heading }: any) => <div data-testid="command-group">{heading}{children}</div>,
    CommandItem: ({ children, onSelect, value }: any) => <div data-testid={`command-item-${value}`} onClick={() => onSelect(value)}>{children}</div>,
}));

describe('SearchCommand', () => {
    const mockRouterPush = jest.fn();
    const mockToggle = jest.fn();
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useUser as jest.Mock).mockReturnValue({
            user: { fullName: 'Test User' },
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        (useQuery as jest.Mock).mockReturnValue([
            { _id: 'doc-1', title: 'First Document', icon: '📝' },
            { _id: 'doc-2', title: 'Second Document', icon: null },
        ]);

        // Setup mock hook implementation for useSearch
        (useSearch as unknown as jest.Mock).mockImplementation((selector: any) => {
            // simulate standard zustand selector behavior
            const storeState = {
                isOpen: true,
                toggle: mockToggle,
                onClose: mockOnClose,
            };
            return selector(storeState);
        });
    });

    it('renders correctly when open', () => {
        render(<SearchCommand />);

        expect(screen.getByTestId('command-dialog')).toBeInTheDocument();
        expect(screen.getByTestId('command-input')).toHaveAttribute('placeholder', "Search Test User's Noted..");

        // Verify mapped documents
        expect(screen.getByTestId('command-item-doc-1')).toHaveTextContent('📝First Document');
        expect(screen.getByTestId('command-item-doc-2')).toHaveTextContent('Second Document');
    });

    it('handles item selection', () => {
        render(<SearchCommand />);

        fireEvent.click(screen.getByTestId('command-item-doc-1'));

        expect(mockRouterPush).toHaveBeenCalledWith('/documents/doc-1');
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('does not render when closed', () => {
        // Override default open state
        (useSearch as unknown as jest.Mock).mockImplementation((selector: any) => {
            return selector({ isOpen: false, toggle: mockToggle, onClose: mockOnClose });
        });

        render(<SearchCommand />);

        expect(screen.queryByTestId('command-dialog')).not.toBeInTheDocument();
    });

    it('registers and handles keyboard shortcut', () => {
        // Override default open state
        (useSearch as unknown as jest.Mock).mockImplementation((selector: any) => {
            return selector({ isOpen: false, toggle: mockToggle, onClose: mockOnClose });
        });

        render(<SearchCommand />);

        // Trigger Cmd+K
        fireEvent.keyDown(document, { key: 'k', metaKey: true });
        expect(mockToggle).toHaveBeenCalledTimes(1);

        // Trigger Ctrl+K
        fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
        expect(mockToggle).toHaveBeenCalledTimes(2);

        // Ensure regular keys do not trigger toggle
        fireEvent.keyDown(document, { key: 'j', metaKey: true });
        expect(mockToggle).toHaveBeenCalledTimes(2);
    });
});
