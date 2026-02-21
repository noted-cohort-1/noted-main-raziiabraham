import * as React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoverImageModal } from '@/components/modals/cover-image-modal';
import { useCoverImage } from '@/hooks/use-cover-image';
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useTrackedUpload } from '@/hooks/use-tracked-upload';

// Mock UI components
jest.mock('@/components/ui/dialog', () => ({
    Dialog: ({ children, open, onOpenChange }: any) => (open ? <div data-testid="cover-dialog" onClick={() => onOpenChange(false)}>{children}</div> : null),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children }: any) => <div data-testid="tabs">{children}</div>,
    TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
    TabsTrigger: ({ children, value }: any) => <button data-testid={`tab-${value}`}>{children}</button>,
    TabsContent: ({ children, value }: any) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

jest.mock('@/components/single-image-dropzone', () => ({
    SingleImageDropzone: ({ onChange, disabled }: any) => (
        <button
            data-testid="dropzone"
            disabled={disabled}
            onClick={(e) => {
                e.stopPropagation();
                onChange(new File([''], 'test.png', { type: 'image/png' }));
            }}
        >
            Dropzone
        </button>
    ),
}));

jest.mock('@/components/file-picker', () => ({
    FilePicker: ({ onSelect }: any) => (
        <button
            data-testid="file-picker"
            onClick={(e) => {
                e.stopPropagation();
                onSelect('https://test.com/image.png');
            }}
        >
            File Picker
        </button>
    ),
}));

// Mock hooks
jest.mock('@/hooks/use-cover-image', () => ({
    useCoverImage: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}));

jest.mock('@/hooks/use-tracked-upload', () => ({
    useTrackedUpload: jest.fn(),
}));

// Mock API route
jest.mock('@/convex/_generated/api', () => ({
    api: {
        documents: {
            update: 'mock-update-action'
        }
    }
}));

describe('CoverImageModal', () => {
    const mockOnClose = jest.fn();
    const mockUpdate = jest.fn();
    const mockUploadFile = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useCoverImage as unknown as jest.Mock).mockReturnValue({
            isOpen: true,
            onClose: mockOnClose,
            url: 'https://old-cover.com/image.png'
        });

        (useParams as jest.Mock).mockReturnValue({
            documentId: 'doc_123'
        });

        (useMutation as jest.Mock).mockReturnValue(mockUpdate);

        (useTrackedUpload as jest.Mock).mockReturnValue({
            uploadFile: mockUploadFile
        });
    });

    it('renders correctly', () => {
        render(<CoverImageModal />);
        expect(screen.getByTestId('cover-dialog')).toBeInTheDocument();
        expect(screen.getByText('Cover Image')).toBeInTheDocument();
        expect(screen.getByTestId('dropzone')).toBeInTheDocument();
        expect(screen.getByTestId('file-picker')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        (useCoverImage as unknown as jest.Mock).mockReturnValue({
            isOpen: false,
            onClose: mockOnClose,
            url: ''
        });

        render(<CoverImageModal />);
        expect(screen.queryByTestId('cover-dialog')).not.toBeInTheDocument();
    });

    it('handles file upload securely', async () => {
        mockUploadFile.mockResolvedValue({ url: 'https://new-upload.com/image.png' });
        mockUpdate.mockResolvedValue({});

        render(<CoverImageModal />);

        // Trigger dropzone mock onChange
        const dropzone = screen.getByTestId('dropzone');
        fireEvent.click(dropzone);

        expect(dropzone).toBeDisabled();

        await waitFor(() => {
            expect(mockUploadFile).toHaveBeenCalledWith(expect.any(File), {
                replaceTargetUrl: 'https://old-cover.com/image.png'
            });
            expect(mockUpdate).toHaveBeenCalledWith({
                id: 'doc_123',
                coverImage: 'https://new-upload.com/image.png'
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('handles selection from existing files cleanly', async () => {
        mockUpdate.mockResolvedValue({});

        render(<CoverImageModal />);

        // Trigger file picker selection
        const filePicker = screen.getByTestId('file-picker');
        fireEvent.click(filePicker);

        await waitFor(() => {
            expect(mockUploadFile).not.toHaveBeenCalled();
            expect(mockUpdate).toHaveBeenCalledWith({
                id: 'doc_123',
                coverImage: 'https://test.com/image.png'
            });
            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    it('resets state efficiently on upload failure', async () => {
        // Suppress console.log for expected error
        jest.spyOn(console, 'log').mockImplementation(() => { });

        mockUploadFile.mockRejectedValue(new Error('Upload failed'));

        render(<CoverImageModal />);

        const dropzone = screen.getByTestId('dropzone');
        fireEvent.click(dropzone);

        expect(dropzone).toBeDisabled();

        await waitFor(() => {
            // It should catch the error, re-enable to dropzone, and not call update
            expect(mockUploadFile).toHaveBeenCalled();
            expect(mockUpdate).not.toHaveBeenCalled();
            expect(mockOnClose).not.toHaveBeenCalled();
            expect(dropzone).not.toBeDisabled();
        });
    });
});
