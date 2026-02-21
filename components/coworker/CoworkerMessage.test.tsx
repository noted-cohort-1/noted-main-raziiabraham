import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CoworkerMessage } from '@/components/coworker/CoworkerMessage';
import { useCoworkerConfig } from '@/hooks/useCoworkerConfig';

// Mock dependencies
jest.mock('@/hooks/useCoworkerConfig', () => ({
    useCoworkerConfig: jest.fn(),
}));

jest.mock('react-markdown', () => {
    return ({ children, components }: any) => {
        return <div data-testid="markdown">{children}</div>;
    };
});

jest.mock('remark-gfm', () => jest.fn());

describe('CoworkerMessage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useCoworkerConfig as unknown as jest.Mock).mockReturnValue({
            isExpanded: false,
        });
    });

    it('renders simple user text message properly', () => {
        render(<CoworkerMessage role="user" content="Hello World" parts={[]} />);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('strips Context block from user messages', () => {
        const content = `[Context: The user has attached the following documents. Please read them first using the readDocument tool before answering:]
- Doc 1 (ID: 1)
- Doc 2 (ID: 2)

Actual message here`;

        render(<CoworkerMessage role="user" content={content} parts={[]} />);
        expect(screen.getByText('Actual message here')).toBeInTheDocument();

        // Check if context pills are rendered
        expect(screen.getByText('Doc 1')).toBeInTheDocument();
        expect(screen.getByText('Doc 2')).toBeInTheDocument();
    });

    it('strips System block from user messages', () => {
        const content = `[System: Local Time: 12:00 PM]

Another message`;

        render(<CoworkerMessage role="user" content={content} parts={[]} />);
        expect(screen.getByText('Another message')).toBeInTheDocument();
        expect(screen.queryByText('Local Time')).not.toBeInTheDocument();
    });

    it('strips File Attachments and renders them as clickable links', () => {
        const content = `[File: data.csv](https://noted.com/data.csv)

Analyze this data`;

        render(<CoworkerMessage role="user" content={content} parts={[]} />);
        expect(screen.getByText('Analyze this data')).toBeInTheDocument();

        const fileLink = screen.getByRole('link');
        expect(fileLink).toHaveAttribute('href', 'https://noted.com/data.csv');
        expect(screen.getByText('data.csv')).toBeInTheDocument();
    });

    it('renders assistant text part through markdown', () => {
        const parts = [
            { type: 'text', text: 'Here is your **answer**' }
        ];

        render(<CoworkerMessage role="assistant" content="" parts={parts} />);

        const markdownContainer = screen.getByTestId('markdown');
        expect(markdownContainer).toHaveTextContent('Here is your **answer**');
    });

    it('renders thinking state when streaming with no parts', () => {
        render(<CoworkerMessage role="assistant" content="" parts={[]} isStreaming={true} />);
        expect(screen.getByText('Thinking')).toBeInTheDocument();
    });

    it('renders reasoning parts properly', () => {
        const parts = [
            { type: 'reasoning', reasoning: 'I should calculate 2+2.' }
        ];

        render(<CoworkerMessage role="assistant" content="" parts={parts} />);

        // Reasoning blocks render "Thought" statically if not streaming or last
        const btn = screen.getByRole('button');
        expect(btn).toHaveTextContent('Thought');

        // Verify toggle mechanism
        fireEvent.click(btn);
        // When expanded, the reasoning should show up in markdown
        expect(screen.getByTestId('markdown')).toHaveTextContent('I should calculate 2+2.');
    });

    it('renders tool calls properly', () => {
        const parts = [
            { type: 'tool-call', toolName: 'searchWorkspace', result: { count: 5 } }
        ];

        render(<CoworkerMessage role="assistant" content="" parts={parts} />);

        expect(screen.getByText('Found 5 result(s)')).toBeInTheDocument();
    });

    it('renders tool in progress', () => {
        const parts = [
            { type: 'tool-call', toolName: 'writeDocument', state: 'call' }
        ];

        render(<CoworkerMessage role="assistant" content="" parts={parts} />);

        expect(screen.getByText('Creating content...')).toBeInTheDocument();
    });
});
