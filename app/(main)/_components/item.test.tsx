import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Item } from '@/app/(main)/_components/item';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileIcon } from 'lucide-react';

// Mock dependencies
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt || 'mocked image'} />;
    },
}));

jest.mock('@clerk/clerk-react', () => ({
    useUser: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: {
        promise: jest.fn(),
    },
}));

jest.mock('@/convex/_generated/api', () => ({
    api: {
        documents: {
            create: 'mock-create',
            archive: 'mock-archive',
        },
    },
}));

describe('Item Component', () => {
    const mockRouterPush = jest.fn();
    const mockCreateMutation = jest.fn();
    const mockArchiveMutation = jest.fn();
    const mockOnClick = jest.fn();
    const mockOnExpand = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useUser as jest.Mock).mockReturnValue({
            user: { fullName: 'Test User' },
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        (useMutation as jest.Mock).mockImplementation((apiFn) => {
            if (apiFn === 'mock-create') return mockCreateMutation;
            if (apiFn === 'mock-archive') return mockArchiveMutation;
            return jest.fn();
        });
    });

    const defaultProps = {
        id: 'test-id' as any,
        label: 'Test Document',
        onClick: mockOnClick,
        icon: FileIcon,
        onExpand: mockOnExpand,
    };

    it('renders correctly with basic props', () => {
        render(<Item label="Simple Item" icon={FileIcon} />);
        expect(screen.getByText('Simple Item')).toBeInTheDocument();
    });

    it('handles click events', () => {
        render(<Item {...defaultProps} />);

        // The main container is a div with role="button" containing the text
        const containerItem = screen.getByText('Test Document').closest('div[role="button"]');
        if (containerItem) fireEvent.click(containerItem);

        expect(mockOnClick).toHaveBeenCalled();
    });

    it('handles expansion toggle', () => {
        render(<Item {...defaultProps} expanded={false} />);

        // The chevron chevron container has role="button"
        const expandButtons = screen.getAllByRole('button');
        // It's the first button (the chevron) inside the main button
        fireEvent.click(expandButtons[1]);

        expect(mockOnExpand).toHaveBeenCalled();
    });

    it('creates new document on plus click', async () => {
        mockCreateMutation.mockResolvedValue('new-doc-id');
        render(<Item {...defaultProps} />);

        // Plus icon container is the last interactive element before dropdown
        // It is nested in the DOM, we can find it by looking for the sibling container of DropdownMenu
        // easiest is to query by clicking the Plus icon directly or its container
        const { container } = render(<Item {...defaultProps} />);

        const svgIconElements = container.querySelectorAll('svg.lucide-plus');
        const plusButtonContainer = svgIconElements[0]?.closest('div[role="button"]');

        if (plusButtonContainer) {
            fireEvent.click(plusButtonContainer);
        } else {
            throw new Error("Could not find Plus button container");
        }

        expect(mockCreateMutation).toHaveBeenCalledWith({
            title: 'Untitled',
            parentDocument: 'test-id',
        });

        expect(toast.promise).toHaveBeenCalled();

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/documents/new-doc-id');
        });
    });

    it('renders skeleton correctly', () => {
        const { container } = render(<Item.Skeleton level={2} />);
        expect(container.firstChild).toHaveClass("pl-[49px]");
    });
});
