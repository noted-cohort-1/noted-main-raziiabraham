import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoworkerFloatingChat } from '@/components/coworker/CoworkerFloatingChat';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery } from 'convex/react';
import { useCoworkerConfig } from '@/hooks/useCoworkerConfig';
import { useChat } from '@ai-sdk/react';
import { useTrackedUpload } from '@/hooks/useTrackedUpload';
import { toast } from 'sonner';

// Mocks
jest.mock('@clerk/nextjs', () => ({
    useAuth: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock('@/hooks/useCoworkerConfig', () => ({
    useCoworkerConfig: jest.fn(),
}));

jest.mock('@ai-sdk/react', () => ({
    useChat: jest.fn(),
}));

jest.mock('@/hooks/useTrackedUpload', () => ({
    useTrackedUpload: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: { error: jest.fn(), success: jest.fn() },
}));

jest.mock('@/components/coworker/CoworkerChat', () => ({
    CoworkerChat: () => <div data-testid="coworker-chat">Chat Messages</div>,
}));

jest.mock('@/components/coworker/CoworkerContextSelector', () => ({
    CoworkerContextSelector: ({ isOpen, onClose, onSelect }: any) => (
        isOpen ? (
            <div data-testid="context-selector">
                <button onClick={() => onSelect('doc-1', 'Test Doc')}>Select Doc</button>
                <button onClick={onClose}>Close Context</button>
            </div>
        ) : null
    ),
}));

jest.mock('@/components/coworker/AgentSlashCommand', () => ({
    AgentSlashCommand: ({ isOpen, onClose, onSelect }: any) => (
        isOpen ? (
            <div data-testid="agent-slash-command">
                <button onClick={() => onSelect({ _id: 'agent-1', name: 'SalesBot' })}>Pick Agent</button>
                <button onClick={onClose}>Close slash command</button>
            </div>
        ) : null
    ),
}));

// Mock API route
jest.mock('@/convex/_generated/api', () => ({
    api: {
        coworkerMessages: {
            getMessages: 'mock-get-messages',
            addMessage: 'mock-add-message',
            clearHistory: 'mock-clear-history'
        }
    }
}));

// Resize observer mock for react-textarea-autosize
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver = ResizeObserver;

describe('CoworkerFloatingChat', () => {
    const mockGetToken = jest.fn();
    const mockSetExpanded = jest.fn();
    const mockSetSidebarWidth = jest.fn();
    const mockSetIsResizing = jest.fn();

    const mockAddMessage = jest.fn();
    const mockClearHistory = jest.fn();

    const mockSendMessage = jest.fn();
    const mockSetMessages = jest.fn();
    const mockUploadFile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({ getToken: mockGetToken });

        (useCoworkerConfig as unknown as jest.Mock).mockReturnValue({
            isExpanded: false,
            setExpanded: mockSetExpanded,
            sidebarWidth: 400,
            setSidebarWidth: mockSetSidebarWidth,
            isResizing: false,
            setIsResizing: mockSetIsResizing,
        });

        (useMutation as jest.Mock).mockImplementation((apiFn) => {
            if (apiFn === 'mock-add-message') return mockAddMessage;
            if (apiFn === 'mock-clear-history') return mockClearHistory;
            return jest.fn();
        });

        (useQuery as jest.Mock).mockReturnValue([]); // No saved messages initially

        (useChat as jest.Mock).mockReturnValue({
            messages: [],
            sendMessage: mockSendMessage,
            status: 'idle',
            setMessages: mockSetMessages,
        });

        (useTrackedUpload as jest.Mock).mockReturnValue({
            uploadFile: mockUploadFile,
        });
    });

    it('renders closed button initially', () => {
        render(<CoworkerFloatingChat />);
        expect(screen.getByRole('button', { name: /open ai squad/i })).toBeInTheDocument();
    });

    it('opens chat window when clicked', () => {
        render(<CoworkerFloatingChat />);
        fireEvent.click(screen.getByRole('button', { name: /open ai squad/i }));

        // Now the chat window should be open
        expect(screen.getByText('AI Squad')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/ask anything/i)).toBeInTheDocument();
    });

    it('collapses back into floating button when close is clicked', () => {
        render(<CoworkerFloatingChat />);
        fireEvent.click(screen.getByRole('button', { name: /open ai squad/i }));

        const closeBtn = screen.getByTitle('Close');
        fireEvent.click(closeBtn);

        expect(screen.getByRole('button', { name: /open ai squad/i })).toBeInTheDocument();
    });

    it('toggles sidebar expanded state', () => {
        render(<CoworkerFloatingChat />);
        fireEvent.click(screen.getByRole('button', { name: /open ai squad/i }));

        const dockBtn = screen.getByTitle('Dock to side');
        fireEvent.click(dockBtn);

        expect(mockSetExpanded).toHaveBeenCalledWith(true);
    });

    it('clears history', async () => {
        render(<CoworkerFloatingChat />);
        fireEvent.click(screen.getByRole('button', { name: /open ai squad/i }));

        const newChatBtn = screen.getByTitle('New chat');
        fireEvent.click(newChatBtn);

        await waitFor(() => {
            expect(mockClearHistory).toHaveBeenCalled();
            expect(mockSetMessages).toHaveBeenCalledWith([]);
        });
    });

    it('handles user submitted text messages', async () => {
        render(<CoworkerFloatingChat />);
        fireEvent.click(screen.getByRole('button', { name: /open ai squad/i }));

        const input = screen.getByPlaceholderText(/ask anything/i);
        fireEvent.change(input, { target: { value: 'Hello Coworker' } });

        // Test the form submission
        const form = input.closest('form');
        fireEvent.submit(form!);

        await waitFor(() => {
            expect(mockAddMessage).toHaveBeenCalledWith(expect.objectContaining({
                content: expect.stringContaining('Hello Coworker'),
                role: 'user'
            }));
            expect(mockSendMessage).toHaveBeenCalled();
        });
    });

    it('opens AgentSlashCommand when / is typed and handles selection', () => {
        render(<CoworkerFloatingChat />);
        fireEvent.click(screen.getByRole('button', { name: /open ai squad/i }));

        const input = screen.getByPlaceholderText(/ask anything/i);
        fireEvent.change(input, { target: { value: '/' } });

        expect(screen.getByTestId('agent-slash-command')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Pick Agent'));

        expect(screen.getByText('SalesBot')).toBeInTheDocument();
    });
});
