import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Mock ResizeObserver for Radix ScrollArea
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('ScrollArea Component', () => {
    it('renders correctly', () => {
        render(
            <ScrollArea className="h-[200px] w-[350px]">
                <div data-testid="scroll-content">
                    Scrollable Content
                </div>
                <ScrollBar orientation="vertical" />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        );

        expect(screen.getByTestId('scroll-content')).toBeInTheDocument();
        expect(screen.getByText('Scrollable Content')).toBeInTheDocument();
    });
});
