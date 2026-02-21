import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heroes } from '@/app/(landing)/_components/Heroes';

describe('Heroes Component', () => {
    it('renders correctly', () => {
        render(<Heroes />);

        // Check if the app preview is present
        expect(screen.getByText("wellnoted.dev")).toBeInTheDocument();

        // Check main title
        expect(screen.getAllByText("Project Tracker")[0]).toBeInTheDocument();

        // Check user text items
        expect(screen.getByText("John's Noted")).toBeInTheDocument();

        // Check table headers
        expect(screen.getByText('Task')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Due')).toBeInTheDocument();

        // Check row data
        expect(screen.getByText('Design landing page')).toBeInTheDocument();
        expect(screen.getByText('Build API endpoints')).toBeInTheDocument();
    });
});
