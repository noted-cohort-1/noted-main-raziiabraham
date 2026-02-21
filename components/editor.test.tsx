import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Editor from '@/components/editor';
import { useConvexAuth, useQuery } from 'convex/react';
import { useAuth } from '@clerk/clerk-react';
import { useTheme } from 'next-themes';
import { useTrackedUpload } from '@/hooks/use-tracked-upload';
import { useFilePicker } from '@/hooks/use-file-picker';

// Mock generic hooks
jest.mock('next-themes', () => ({
    useTheme: jest.fn(),
}));

jest.mock('@clerk/clerk-react', () => ({
    useAuth: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useConvexAuth: jest.fn(),
    useQuery: jest.fn(),
}));

jest.mock('@/hooks/use-tracked-upload', () => ({
    useTrackedUpload: jest.fn(),
}));

jest.mock('@/hooks/use-file-picker', () => ({
    useFilePicker: jest.fn(),
}));

// Provide access to the mocked instances inside tests
const mockReplaceBlocks = jest.fn();
const mockTryParseMarkdownToBlocks = jest.fn();
const mockForEachBlock = jest.fn();

// The jest.mock factory cannot access variables declared outside unless they start with 'mock'
// But we can define the implementations directly inside and export them or use generic mocks
jest.mock('@blocknote/react', () => {
    return {
        useCreateBlockNote: jest.fn().mockImplementation(() => ({
            document: [],
            replaceBlocks: mockReplaceBlocks,
            tryParseMarkdownToBlocks: mockTryParseMarkdownToBlocks,
            forEachBlock: mockForEachBlock,
        })),
        useDictionary: jest.fn().mockReturnValue({}),
        getDefaultReactSlashMenuItems: jest.fn().mockReturnValue([]),
        SuggestionMenuController: () => <div data-testid="suggestion-menu-controller" />,
        FormattingToolbarController: () => <div data-testid="formatting-toolbar-controller" />,
        FormattingToolbar: ({ children }: any) => <div>{children}</div>,
        getFormattingToolbarItems: jest.fn().mockReturnValue([]),
    };
});

jest.mock('@blocknote/mantine', () => ({
    BlockNoteView: ({ children, onChange }: any) => (
        <div data-testid="blocknote-view" onChange={onChange}>
            {children}
        </div>
    ),
}));

jest.mock('@blocknote/core/extensions', () => ({
    filterSuggestionItems: jest.fn(),
}));

jest.mock('@blocknote/xl-ai', () => ({
    AIExtension: jest.fn(),
    getAISlashMenuItems: jest.fn().mockReturnValue([]),
    AIMenuController: () => <div data-testid="ai-menu-controller" />,
    AIToolbarButton: () => <div data-testid="ai-toolbar-button" />,
}));

describe('Editor Component', () => {
    const mockOnChange = jest.fn();
    const mockUploadFile = jest.fn();
    const mockDeleteFile = jest.fn();
    const mockGetToken = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useTheme as jest.Mock).mockReturnValue({ resolvedTheme: 'light' });

        (useConvexAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
        });

        (useAuth as jest.Mock).mockReturnValue({
            getToken: mockGetToken,
        });

        (useQuery as jest.Mock).mockReturnValue(true); // Mock hasAiConfig to true

        (useTrackedUpload as jest.Mock).mockReturnValue({
            uploadFile: mockUploadFile,
            deleteFile: mockDeleteFile,
        });

        (useFilePicker as unknown as jest.Mock).mockReturnValue({
            onOpen: jest.fn(),
        });

        // Setup mock default returns for blocknote editor instance methods
        mockTryParseMarkdownToBlocks.mockReturnValue([{ type: 'paragraph', content: 'markdown parsed' }]);
    });

    it('renders the editor with AI extensions', () => {
        render(<Editor onChange={mockOnChange} />);

        expect(screen.getByTestId('blocknote-view')).toBeInTheDocument();
        expect(screen.getByTestId('suggestion-menu-controller')).toBeInTheDocument();
        expect(screen.getByTestId('formatting-toolbar-controller')).toBeInTheDocument();
        expect(screen.getByTestId('ai-menu-controller')).toBeInTheDocument();
    });

    it('handles initialization with JSON content safely', () => {
        const initialJson = JSON.stringify([{ type: 'paragraph', content: 'test docs' }]);
        render(<Editor onChange={mockOnChange} initialContent={initialJson} />);

        expect(screen.getByTestId('blocknote-view')).toBeInTheDocument();
        // The mock useCreateBlockNote handles the parsed initialContent prop under the hood in real life.
        // We verify that it doesn't try to parse it as markdown since JSON is valid.
        expect(mockTryParseMarkdownToBlocks).not.toHaveBeenCalled();
    });

    it('handles initialization with markdown fallback content safely', async () => {
        const initialMarkdown = "# This is a markdown header";
        render(<Editor onChange={mockOnChange} initialContent={initialMarkdown} />);

        // When JSON.parse fails, it should fallback to tryParseMarkdownToBlocks
        await waitFor(() => {
            expect(mockTryParseMarkdownToBlocks).toHaveBeenCalledWith(initialMarkdown);
            expect(mockReplaceBlocks).toHaveBeenCalled();
        });
    });
});
