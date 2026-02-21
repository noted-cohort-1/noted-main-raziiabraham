import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { useSettings } from '@/hooks/useSettings';
import { useAiSettings } from '@/hooks/useAiSettings';
import { useQuery, useAction, useMutation, useConvexAuth } from 'convex/react';
import { toast } from 'sonner';

// Mock UI dependencies
jest.mock('@/components/mode-toggle', () => ({
    ModeToggle: () => <div data-testid="mode-toggle">Mode Toggle</div>,
}));

jest.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children, open, onOpenChange }: any) => (open ? <div data-testid="settings-dialog">{children}</div> : null),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

// Mock hooks
jest.mock('@/hooks/useSettings', () => ({
    useSettings: jest.fn(),
}));

jest.mock('@/hooks/useAiSettings', () => ({
    useAiSettings: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useQuery: jest.fn(),
    useAction: jest.fn(),
    useMutation: jest.fn(),
    useConvexAuth: jest.fn(),
}));

jest.mock('@/convex/_generated/api', () => ({
    api: {
        aiSettingsActions: {
            testConnection: 'mock-test-connection',
            saveSettings: 'mock-save-settings',
        },
        aiSettings: {
            deleteSettings: 'mock-delete-settings',
            getSettings: 'mock-get-settings',
        }
    }
}));

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('SettingsModal', () => {
    const mockOnClose = jest.fn();
    const mockTestConnection = jest.fn();
    const mockSaveSettings = jest.fn();
    const mockDeleteSettings = jest.fn();
    const mockSetApiKey = jest.fn();
    const mockSetSelectedProvider = jest.fn();
    const mockSetSelectedModel = jest.fn();
    const mockSetIsTesting = jest.fn();
    const mockSetIsLoading = jest.fn();
    const mockSetHasKey = jest.fn();
    const mockReset = jest.fn();

    const baseAiSettings = {
        selectedProvider: 'openai',
        selectedModel: 'gpt-4o',
        apiKey: '',
        hasOpenAIKey: true,
        hasAnthropicKey: false,
        hasGoogleKey: false,
        isLoading: false,
        isTesting: false,
        setApiKey: mockSetApiKey,
        setSelectedProvider: mockSetSelectedProvider,
        setSelectedModel: mockSetSelectedModel,
        setIsTesting: mockSetIsTesting,
        setIsLoading: mockSetIsLoading,
        setHasKey: mockSetHasKey,
        reset: mockReset,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        (useConvexAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });

        (useSettings as unknown as jest.Mock).mockReturnValue({
            isOpen: true,
            onClose: mockOnClose,
        });

        (useAiSettings as unknown as jest.Mock).mockReturnValue({ ...baseAiSettings });

        (useQuery as jest.Mock).mockReturnValue({
            hasOpenAIKey: true,
            provider: 'openai',
            model: 'gpt-4o'
        });

        (useAction as jest.Mock).mockImplementation((actionSpec) => {
            if (actionSpec === 'mock-test-connection') return mockTestConnection;
            if (actionSpec === 'mock-save-settings') return mockSaveSettings;
            return jest.fn();
        });

        (useMutation as jest.Mock).mockImplementation((mutationSpec) => {
            if (mutationSpec === 'mock-delete-settings') return mockDeleteSettings;
            return jest.fn();
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders correctly and defaults to appearance tab', () => {
        render(<SettingsModal />);

        expect(screen.getByTestId('settings-dialog')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Appearance" })).toBeInTheDocument();
        expect(screen.getByTestId('mode-toggle')).toBeInTheDocument();
    });

    it('switches to AI Settings tab and renders fields', () => {
        render(<SettingsModal />);

        // Click AI Settings tab
        fireEvent.click(screen.getByRole('button', { name: "AI Settings" }));

        // Verify AI fields are rendered
        expect(screen.getByText('AI Provider')).toBeInTheDocument();
        // In our mock state, OpenAI is selected and it's active.
        expect(screen.getByText('OpenAI API Key')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /test connection/i })).toBeInTheDocument();
    });

    it('handles API connection testing', async () => {
        (useAiSettings as unknown as jest.Mock).mockReturnValue({
            ...baseAiSettings,
            selectedProvider: 'openai',
            apiKey: 'sk-test-123', // Non-empty key to allow testing
            hasOpenAIKey: false,
        });
        mockTestConnection.mockResolvedValue({ success: true });

        render(<SettingsModal />);
        fireEvent.click(screen.getByRole('button', { name: "AI Settings" }));

        const testBtn = screen.getByRole('button', { name: /test connection/i });
        fireEvent.click(testBtn);

        expect(mockSetIsTesting).toHaveBeenCalledWith(true);
        await waitFor(() => {
            expect(mockTestConnection).toHaveBeenCalledWith({ provider: 'openai', apiKey: 'sk-test-123' });
            expect(toast.success).toHaveBeenCalledWith("Connection successful!");
            expect(mockSetIsTesting).toHaveBeenCalledWith(false);
        });
    });

    it('handles save settings', async () => {
        (useAiSettings as unknown as jest.Mock).mockReturnValue({
            ...baseAiSettings,
            selectedProvider: 'openai',
            selectedModel: 'gpt-4o',
            apiKey: 'sk-new-key',
            hasOpenAIKey: true,
        });
        mockSaveSettings.mockResolvedValue({});

        render(<SettingsModal />);
        fireEvent.click(screen.getByRole('button', { name: "AI Settings" }));

        const saveBtn = screen.getByRole('button', { name: /save/i });
        fireEvent.click(saveBtn);

        expect(mockSetIsLoading).toHaveBeenCalledWith(true);

        await waitFor(() => {
            expect(mockSaveSettings).toHaveBeenCalledWith({
                provider: 'openai',
                apiKey: 'sk-new-key',
                model: 'gpt-4o',
                makeActive: true
            });
            expect(toast.success).toHaveBeenCalledWith("Settings saved successfully!");
            expect(mockSetHasKey).toHaveBeenCalledWith('openai', true);
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles remove all settings with confirmation', async () => {
        window.confirm = jest.fn().mockReturnValue(true);
        mockDeleteSettings.mockResolvedValue({});

        render(<SettingsModal />);
        fireEvent.click(screen.getByRole('button', { name: "AI Settings" }));

        const removeBtn = screen.getByRole('button', { name: /remove all settings/i });
        fireEvent.click(removeBtn);

        expect(window.confirm).toHaveBeenCalled();

        await waitFor(() => {
            expect(mockDeleteSettings).toHaveBeenCalled();
            expect(mockReset).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("All settings removed successfully");
        });
    });
});
