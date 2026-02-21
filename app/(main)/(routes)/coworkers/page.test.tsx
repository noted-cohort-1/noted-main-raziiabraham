import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CoworkersPage from '@/app/(main)/(routes)/coworkers/page';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';

// Mocks
jest.mock('@clerk/nextjs', () => ({
    useUser: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: { promise: jest.fn() },
}));

jest.mock('@/app/(main)/_components/CoworkerCard', () => ({
    CoworkerCard: ({ name }: any) => <div data-testid={`coworker-card-${name}`}>{name}</div>,
}));

// Mock API route
jest.mock('@/convex/_generated/api', () => ({
    api: {
        documents: {
            create: 'mock-doc-create',
            update: 'mock-doc-update',
        },
        squadAgents: {
            list: 'mock-agents-list',
            create: 'mock-agent-create',
        }
    }
}));

// Mock unique names to ensure consistent testing
jest.mock('unique-names-generator', () => ({
    uniqueNamesGenerator: () => 'angry bear',
    adjectives: [],
    animals: []
}));

jest.mock('node-emoji', () => ({
    random: () => ({ emoji: '🐻' })
}));

describe('CoworkersPage', () => {
    const mockRouterPush = jest.fn();
    const mockCreateDocument = jest.fn();
    const mockUpdateDocument = jest.fn();
    const mockCreateAgent = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useUser as jest.Mock).mockReturnValue({ user: { fullName: 'Test User' } });
        (useRouter as jest.Mock).mockReturnValue({ push: mockRouterPush });

        (useMutation as jest.Mock).mockImplementation((apiFn) => {
            if (apiFn === 'mock-doc-create') return mockCreateDocument;
            if (apiFn === 'mock-doc-update') return mockUpdateDocument;
            if (apiFn === 'mock-agent-create') return mockCreateAgent;
            return jest.fn();
        });

        (useQuery as jest.Mock).mockReturnValue([
            { _id: '1', name: 'SalesBot', description: 'Handles sales' },
            { _id: '2', name: 'SupportBot', description: 'Handles support' },
        ]);
    });

    it('renders loading state', () => {
        (useQuery as jest.Mock).mockReturnValue(undefined);
        render(<CoworkersPage />);
        expect(screen.getByText('AI Squad')).toBeInTheDocument();
    });

    it('renders correctly with agents', () => {
        render(<CoworkersPage />);

        expect(screen.getByText('AI Squad')).toBeInTheDocument();
        expect(screen.getByTestId('coworker-card-SalesBot')).toBeInTheDocument();
        expect(screen.getByTestId('coworker-card-SupportBot')).toBeInTheDocument();
    });

    it('filters agents based on search query', () => {
        render(<CoworkersPage />);

        const searchInput = screen.getByPlaceholderText('Search squad agents...');
        fireEvent.change(searchInput, { target: { value: 'Sales' } });

        expect(screen.getByTestId('coworker-card-SalesBot')).toBeInTheDocument();
        expect(screen.queryByTestId('coworker-card-SupportBot')).not.toBeInTheDocument();
    });

    it('toggles to Tools tab', () => {
        render(<CoworkersPage />);

        const toolsTab = screen.getByText('Tools');
        fireEvent.click(toolsTab);

        expect(screen.getByText('Build Custom Tools')).toBeInTheDocument();
        expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('handles agent creation', async () => {
        mockCreateDocument.mockResolvedValue('new-doc-id');
        mockUpdateDocument.mockResolvedValue({});
        mockCreateAgent.mockResolvedValue('new-agent-id');

        render(<CoworkersPage />);

        const createBtn = screen.getByText('Create Agent');
        fireEvent.click(createBtn);

        await waitFor(() => {
            expect(mockCreateDocument).toHaveBeenCalledWith({
                title: 'angry bear',
                content: expect.any(String)
            });
            expect(mockUpdateDocument).toHaveBeenCalledWith({
                id: 'new-doc-id',
                icon: '🐻'
            });
            expect(mockCreateAgent).toHaveBeenCalledWith({
                name: 'angry bear',
                description: expect.any(String),
                icon: '🐻',
                instructionsDocId: 'new-doc-id'
            });
            expect(mockRouterPush).toHaveBeenCalledWith('/documents/new-doc-id');
            expect(toast.promise).toHaveBeenCalled();
        });
    });
});
