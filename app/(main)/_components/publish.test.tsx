import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Publish } from '@/app/(main)/_components/publish';
import { useOrigin } from '@/hooks/use-origin';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

// Mocks
jest.mock('@/hooks/use-origin', () => ({
    useOrigin: jest.fn(),
}));

jest.mock('convex/react', () => ({
    useMutation: jest.fn(),
}));

jest.mock('sonner', () => ({
    toast: { promise: jest.fn() },
}));

const mockDoc = {
    _id: 'doc-123',
    title: 'Test Doc',
    isPublished: false,
} as any;

const mockPublishedDoc = {
    ...mockDoc,
    isPublished: true,
};

describe('Publish Component', () => {
    const mockUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useOrigin as jest.Mock).mockReturnValue('https://noted.com');
        (useMutation as jest.Mock).mockReturnValue(mockUpdate);
    });

    it('renders correctly when unpublished', () => {
        render(<Publish initialData={mockDoc} />);

        // Open popover by clicking the trigger (first publish button)
        const triggerBtn = screen.getByRole('button', { name: /publish/i });
        fireEvent.click(triggerBtn);

        // Check unpublished state text
        expect(screen.getByText('Published this note')).toBeInTheDocument();

        // Now there are two publish buttons (trigger and the one inside)
        expect(screen.getAllByRole('button', { name: 'Publish' })).toHaveLength(2);
    });

    it('renders correctly when published', () => {
        render(<Publish initialData={mockPublishedDoc} />);

        const triggerBtn = screen.getByRole('button', { name: /publish/i });
        fireEvent.click(triggerBtn);

        expect(screen.getByText('This note is live on the web.')).toBeInTheDocument();
        expect(screen.getByDisplayValue('https://noted.com/preview/doc-123')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Unpublish' })).toBeInTheDocument();
    });

    it('handles publish action', async () => {
        mockUpdate.mockResolvedValue({});
        render(<Publish initialData={mockDoc} />);

        const triggerBtn = screen.getByRole('button', { name: /publish/i });
        fireEvent.click(triggerBtn);

        // Get the second publish button (the one inside the popover)
        const publishBtns = screen.getAllByRole('button', { name: 'Publish' });
        const actionBtn = publishBtns[1];
        fireEvent.click(actionBtn);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({ id: 'doc-123', isPublished: true });
            expect(toast.promise).toHaveBeenCalled();
        });
    });

    it('handles unpublish action', async () => {
        mockUpdate.mockResolvedValue({});
        render(<Publish initialData={mockPublishedDoc} />);

        const triggerBtn = screen.getByRole('button', { name: /publish/i });
        fireEvent.click(triggerBtn);

        const unpublishBtn = screen.getByRole('button', { name: 'Unpublish' });
        fireEvent.click(unpublishBtn);

        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledWith({ id: 'doc-123', isPublished: false });
            expect(toast.promise).toHaveBeenCalled();
        });
    });

    it('handles copy url action', async () => {
        Object.assign(navigator, {
            clipboard: {
                writeText: jest.fn().mockImplementation(() => Promise.resolve()),
            },
        });

        render(<Publish initialData={mockPublishedDoc} />);
        const triggerBtn = screen.getByRole('button', { name: /publish/i });
        fireEvent.click(triggerBtn);

        const input = screen.getByDisplayValue('https://noted.com/preview/doc-123');
        const copyButton = input.nextElementSibling as HTMLButtonElement;

        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://noted.com/preview/doc-123');
    });
});
