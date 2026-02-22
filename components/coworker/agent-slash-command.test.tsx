import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AgentSlashCommand } from '@/components/coworker/agent-slash-command';
import { useQuery, useAction } from 'convex/react';

// --- Mocks ---

jest.mock('convex/react', () => ({
    useQuery: jest.fn(),
    useAction: jest.fn(),
}));

jest.mock('@/convex/_generated/api', () => ({
    api: {
        squadAgents: { list: 'mock-squad-agents-list' },
        aiSettings: { getSettings: 'mock-get-settings' },
        aiSettingsActions: { listRelevanceAgents: 'mock-list-relevance-agents' },
    },
}));

// Minimal Command UI mock
jest.mock('@/components/ui/command', () => ({
    Command: ({ children }: any) => <div>{children}</div>,
    CommandList: ({ children }: any) => <div>{children}</div>,
    CommandEmpty: ({ children }: any) => <div>{children}</div>,
    CommandGroup: ({ heading, children }: any) => (
        <div>
            <span data-testid={`group-${heading}`}>{heading}</span>
            {children}
        </div>
    ),
    CommandItem: ({ children, onSelect }: any) => (
        <div role="option" onClick={onSelect}>{children}</div>
    ),
}));

// --- Test Data ---

const mockNotedAgents = [
    { _id: 'noted-1', name: 'Research Bot', description: 'Researches topics', icon: '🔍' },
    { _id: 'noted-2', name: 'Writer Bot', description: 'Writes content', icon: '✍️' },
];

const mockRelevanceAgents = [
    { id: 'rel-1', name: 'Lead Scorer', description: 'Scores leads from CRM', icon: '⚡' },
    { id: 'rel-2', name: 'Email Drafter', description: 'Drafts personalised emails' },
];

// --- Tests ---

describe('AgentSlashCommand', () => {
    const mockOnSelect = jest.fn();
    const mockOnClose = jest.fn();
    const mockListRelevanceAgents = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Default: Noted agents available, Relevance key present
        (useQuery as jest.Mock).mockImplementation((key: any) => {
            if (key === 'mock-squad-agents-list') return mockNotedAgents;
            if (key === 'mock-get-settings') return { hasRelevanceKey: true };
            return null;
        });

        (useAction as jest.Mock).mockImplementation(() => mockListRelevanceAgents);
        mockListRelevanceAgents.mockResolvedValue(mockRelevanceAgents);
    });

    it('returns null when isOpen is false', () => {
        const { container } = render(
            <AgentSlashCommand isOpen={false} onSelect={mockOnSelect} onClose={mockOnClose} />
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders Noted Squad Agents when open', () => {
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
        expect(screen.getByText('Research Bot')).toBeInTheDocument();
        expect(screen.getByText('Writer Bot')).toBeInTheDocument();
    });

    it('renders "Available Agents" group heading for Noted agents', () => {
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
        expect(screen.getByTestId('group-Available Agents')).toBeInTheDocument();
    });

    it('fetches Relevance agents on open when key is present', async () => {
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
        await waitFor(() => {
            expect(mockListRelevanceAgents).toHaveBeenCalledWith({});
        });
    });

    it('renders Relevance agents under a "Relevance AI" group after fetch', async () => {
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
        await waitFor(() => {
            expect(screen.getByText('Lead Scorer')).toBeInTheDocument();
            expect(screen.getByText('Email Drafter')).toBeInTheDocument();
            expect(screen.getByTestId('group-Relevance AI')).toBeInTheDocument();
        });
    });

    it('does NOT fetch Relevance agents when no key is configured', () => {
        (useQuery as jest.Mock).mockImplementation((key: any) => {
            if (key === 'mock-squad-agents-list') return mockNotedAgents;
            if (key === 'mock-get-settings') return { hasRelevanceKey: false };
            return null;
        });

        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
        expect(mockListRelevanceAgents).not.toHaveBeenCalled();
    });

    it('does NOT show Relevance AI group when no key is configured', () => {
        (useQuery as jest.Mock).mockImplementation((key: any) => {
            if (key === 'mock-squad-agents-list') return mockNotedAgents;
            if (key === 'mock-get-settings') return { hasRelevanceKey: false };
            return null;
        });

        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);
        expect(screen.queryByTestId('group-Relevance AI')).not.toBeInTheDocument();
    });

    it('calls onSelect with a relevanceId flag when a Relevance agent is chosen', async () => {
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

        await waitFor(() => {
            expect(screen.getByText('Lead Scorer')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Lead Scorer'));

        expect(mockOnSelect).toHaveBeenCalledWith(
            expect.objectContaining({ relevanceId: 'rel-1', name: 'Lead Scorer' })
        );
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('calls onSelect without relevanceId when a Noted agent is chosen', () => {
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

        fireEvent.click(screen.getByText('Research Bot'));

        expect(mockOnSelect).toHaveBeenCalledWith(
            expect.objectContaining({ _id: 'noted-1' })
        );
        expect(mockOnSelect).toHaveBeenCalledWith(
            expect.not.objectContaining({ relevanceId: expect.anything() })
        );
    });

    it('silently handles errors from listRelevanceAgents', async () => {
        mockListRelevanceAgents.mockRejectedValue(new Error('API Error'));

        // Should not throw
        render(<AgentSlashCommand isOpen={true} onSelect={mockOnSelect} onClose={mockOnClose} />);

        await waitFor(() => {
            // Relevance group should not appear
            expect(screen.queryByTestId('group-Relevance AI')).not.toBeInTheDocument();
        });
    });
});
