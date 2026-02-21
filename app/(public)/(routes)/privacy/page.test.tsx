import React from 'react';
import { render, screen } from '@testing-library/react';
import PrivacyPage from '@/app/(public)/(routes)/privacy/page';

describe('PrivacyPage', () => {
    it('renders the Privacy Policy heading', () => {
        render(<PrivacyPage />);
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('contains contact email link', () => {
        render(<PrivacyPage />);
        expect(screen.getByRole('link', { name: /razii.abrhm@gmail.com/i })).toHaveAttribute('href', 'mailto:razii.abrhm@gmail.com');
    });
});
