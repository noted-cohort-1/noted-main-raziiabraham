import * as React from 'react';
import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock Provider implementations since they often require specific contexts (Convex, EdgeStore)
jest.mock('@/components/providers/convex-provider', () => ({
    ConvexClientProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="convex-provider">{children}</div>,
}));

jest.mock('@/lib/edgestore', () => ({
    EdgeStoreProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="edgestore-provider">{children}</div>,
}));

jest.mock('@/components/providers/theme-provider', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

jest.mock('@/components/providers/modal-provider', () => ({
    ModalProvider: () => <div data-testid="modal-provider" />,
}));

jest.mock('@/components/providers/amplitude-provider', () => ({
    AmplitudeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="amplitude-provider">{children}</div>,
}));

jest.mock('sonner', () => ({
    Toaster: () => <div data-testid="toaster" />,
}));

describe('RootLayout', () => {
    it('renders children within providers', () => {
        const { getByTestId, getByText } = render(
            <RootLayout>
                <div data-testid="child-element">Test Content</div>
            </RootLayout>
        );

        expect(getByTestId('convex-provider')).toBeInTheDocument();
        expect(getByTestId('amplitude-provider')).toBeInTheDocument();
        expect(getByTestId('edgestore-provider')).toBeInTheDocument();
        expect(getByTestId('theme-provider')).toBeInTheDocument();
        expect(getByTestId('toaster')).toBeInTheDocument();
        expect(getByTestId('modal-provider')).toBeInTheDocument();
        expect(getByTestId('child-element')).toBeInTheDocument();
        expect(getByText('Test Content')).toBeInTheDocument();
    });
});
