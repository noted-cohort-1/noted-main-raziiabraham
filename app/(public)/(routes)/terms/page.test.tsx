import React from 'react';
import { render, screen } from '@testing-library/react';
import TermsOfServicePage from '@/app/(public)/(routes)/terms/page';

describe('TermsOfServicePage', () => {
    it('renders the Terms of Service heading', () => {
        render(<TermsOfServicePage />);
        expect(screen.getByRole('heading', { level: 1, name: /terms of service/i })).toBeInTheDocument();
    });

    it('renders important sections', () => {
        render(<TermsOfServicePage />);
        expect(screen.getByText('Agreement to Terms')).toBeInTheDocument();
        expect(screen.getByText('Account Registration and Security')).toBeInTheDocument();
        expect(screen.getByText('Acceptable Use Policy')).toBeInTheDocument();
        expect(screen.getByText('Your Content and Data')).toBeInTheDocument();
    });

    it('contains contact email link', () => {
        render(<TermsOfServicePage />);
        expect(screen.getByRole('link', { name: /razii.abrhm@gmail.com/i })).toHaveAttribute('href', 'mailto:razii.abrhm@gmail.com');
    });
});
