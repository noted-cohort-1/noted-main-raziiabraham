import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilesPage from '@/app/(main)/(routes)/files/page';
import { useAuth } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';

// Mocks
jest.mock('@clerk/clerk-react', () => ({
    useAuth: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useQuery: jest.fn(),
}));

jest.mock('@/components/modals/file-viewer-modal', () => ({
    FileViewerModal: ({ file, onClose }: any) => (
        file ? (
            <div data-testid="file-viewer-modal">
                {file.name}
                <button onClick={onClose}>Close Viewer</button>
            </div>
        ) : null
    )
}));

jest.mock('@/components/ui/progress', () => ({
    Progress: ({ value }: any) => <div data-testid="progress-bar">{value}%</div>
}));

// Mock API route
jest.mock('@/convex/_generated/api', () => ({
    api: {
        files: { get: 'mock-files-get' },
        storage: { getStorageUsage: 'mock-storage-get' }
    }
}));

describe('FilesPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAuth as jest.Mock).mockReturnValue({ userId: 'user-123' });
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    const setupMocks = (files: any, storage: any) => {
        (useQuery as jest.Mock).mockImplementation((apiFn) => {
            if (apiFn === 'mock-storage-get') {
                return storage;
            }
            return files;
        });
    }

    it('renders loading state initially', () => {
        setupMocks(undefined, undefined);
        render(<FilesPage />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders empty state correctly', () => {
        setupMocks([], { bytesUsed: 0, limit: 100 * 1024 * 1024 });
        render(<FilesPage />);

        expect(screen.getByText('No files uploaded yet.')).toBeInTheDocument();
        expect(screen.getByText('0.00 MB of 100 MB used')).toBeInTheDocument();
    });

    it('renders files grid correctly', () => {
        setupMocks([
            { _id: '1', name: 'image.png', type: 'image/png', url: 'https://test.com/image.png', size: 1024 * 1024 },
            { _id: '2', name: 'video.mp4', type: 'video/mp4', url: 'https://test.com/video.mp4', size: 5 * 1024 * 1024 },
            { _id: '3', name: 'doc.pdf', type: 'application/pdf', url: 'https://test.com/doc.pdf', size: 2 * 1024 * 1024 },
        ], { bytesUsed: 50 * 1024 * 1024, limit: 100 * 1024 * 1024 });

        render(<FilesPage />);

        expect(screen.getByText('Files')).toBeInTheDocument();
        expect(screen.getByText('50.00 MB of 100 MB used')).toBeInTheDocument();

        expect(screen.getByText('image.png')).toBeInTheDocument();
        expect(screen.getByText('video.mp4')).toBeInTheDocument();
        expect(screen.getByText('doc.pdf')).toBeInTheDocument();
    });

    it('opens file viewer on click', () => {
        setupMocks([
            { _id: '1', name: 'special-image.png', type: 'image/png', url: 'https://test.com/special.png', size: 1024 * 1024 },
        ], { bytesUsed: 50 * 1024 * 1024, limit: 100 * 1024 * 1024 });

        render(<FilesPage />);

        const fileCard = screen.getByText('special-image.png').closest('div');
        fireEvent.click(fileCard!);

        expect(screen.getByTestId('file-viewer-modal')).toBeInTheDocument();
    });
});
