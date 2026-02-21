import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DocumentsPage from '@/app/(main)/(routes)/documents/page';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

// We only specify the required convex api structure
jest.mock('@/convex/_generated/api', () => ({
    api: {
        documents: {
            create: 'mock-create-mutation',
        },
    },
}));

describe('DocumentsPage', () => {
    const mockRouterPush = jest.fn();
    const mockCreateMutation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useUser as jest.Mock).mockReturnValue({
            user: { firstName: 'TestUser' },
        });

        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        (useMutation as jest.Mock).mockReturnValue(mockCreateMutation);
    });

    it('renders correctly', () => {
        render(<DocumentsPage />);

        expect(screen.getByText("Welcome to TestUser's Noted")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create a note/i })).toBeInTheDocument();

        const images = screen.getAllByAltText('empty');
        expect(images).toHaveLength(2);
    });

    it('calls create mutation and router push on button click', async () => {
        // Setup mutation to return a mock document ID
        mockCreateMutation.mockResolvedValue('new-doc-id');

        render(<DocumentsPage />);

        const button = screen.getByRole('button', { name: /create a note/i });
        fireEvent.click(button);

        // Verify mutation was called
        expect(mockCreateMutation).toHaveBeenCalledWith({ title: 'Untitled' });

        // Verify toast promise was called
        expect(toast.promise).toHaveBeenCalled();

        // Verify router push happens after promise resolves
        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/documents/new-doc-id');
        });
    });
});
