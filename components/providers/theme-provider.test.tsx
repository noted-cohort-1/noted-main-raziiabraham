import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/providers/theme-provider';

// Mock matchMedia for next-themes which is commonly used
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('ThemeProvider', () => {
    it('renders children without crashing', () => {
        render(
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <div data-testid="child">Child Content</div>
            </ThemeProvider>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });
});
