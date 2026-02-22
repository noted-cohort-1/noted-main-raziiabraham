"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCoworkerConfig } from "@/hooks/use-coworker-config";
import {
    ChevronRight,
    CheckCircle2,
    Loader2,
    Search,
    FileText,
    PenLine,
    FolderOpen,
    Lightbulb,
    Edit3,
    Paperclip
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Part types from AI SDK
interface MessagePart {
    type: string;
    text?: string;
    reasoning?: string;
    toolCallId?: string;
    toolName?: string;
    args?: any;
    result?: any;
    state?: string;
    output?: any;
    input?: any;
}

interface CoworkerMessageProps {
    role: "user" | "assistant";
    content: string;
    parts: MessagePart[];
    isStreaming?: boolean;
    agentName?: string;
}

// Get display name for tool
function getToolDisplayName(toolName: string, result?: any, state?: string, agentName?: string) {
    const isDone = state === 'result' || result !== undefined;

    switch (toolName) {
        case 'searchWorkspace':
            if (!isDone) return 'Searching...';
            const count = result?.count || result?.results?.length || 0;
            return `Found ${count} result(s)`;
        case 'readDocument':
            return isDone ? 'Read 1 document(s)' : 'Reading document...';
        case 'writeDocument':
            return isDone ? (result?.message || 'Content created') : 'Creating content...';
        case 'editDocument':
            return isDone ? 'Updated document' : 'Editing document...';
        case 'listDocuments':
            if (!isDone) return 'Listing documents...';
            const docCount = result?.count || result?.documents?.length || 0;
            return `Found ${docCount} document(s)`;
        case 'invoke_relevance_agent':
            return isDone
                ? `${agentName || 'Agent'} completed`
                : `Calling ${agentName || 'agent'}...`;
        default:
            return toolName;
    }
}

// Markdown Components for proper styling
const MarkdownComponents = {
    p: ({ children }: any) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
    ul: ({ children }: any) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
    li: ({ children }: any) => <li className="pl-1">{children}</li>,
    h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>,
    blockquote: ({ children }: any) => <blockquote className="border-l-2 border-muted pl-3 italic text-muted-foreground my-2">{children}</blockquote>,
    pre: ({ children }: any) => <pre className="bg-muted/50 p-2 rounded-md overflow-x-auto text-xs my-2 font-mono">{children}</pre>,
    code: ({ node, inline, className, children, ...props }: any) => {
        return inline ? (
            <code className="bg-muted px-1 py-0.5 rounded font-mono text-[11px] whitespace-pre-wrap break-all" {...props}>
                {children}
            </code>
        ) : (
            <code className="block font-mono text-xs whitespace-pre" {...props}>
                {children}
            </code>
        );
    },
    a: ({ href, children }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4">{children}</a>,
    table: ({ children }: any) => <div className="overflow-x-auto my-2"><table className="min-w-full divide-y divide-border border rounded-md text-sm">{children}</table></div>,
    thead: ({ children }: any) => <thead className="bg-muted/50">{children}</thead>,
    tbody: ({ children }: any) => <tbody className="divide-y divide-border">{children}</tbody>,
    tr: ({ children }: any) => <tr>{children}</tr>,
    th: ({ children }: any) => <th className="px-3 py-2 text-left font-medium text-muted-foreground">{children}</th>,
    td: ({ children }: any) => <td className="px-3 py-2">{children}</td>,
};

// Render a single part
function renderPart(part: MessagePart, index: number, isStreaming: boolean, isLastReasoningPart: boolean, agentName?: string) {
    const key = `part-${index}`;

    // Text part
    if (part.type === 'text' && part.text) {
        return (
            <div key={key} className="text-sm leading-relaxed bg-transparent px-0 py-1 text-foreground">
                <div className="prose-sm dark:prose-invert">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                    >
                        {part.text}
                    </ReactMarkdown>
                </div>
            </div>
        );
    }

    // Reasoning part
    if (part.type === 'reasoning') {
        const reasoningText = part.reasoning || part.text || '';

        // Extract dynamic header from reasoning
        const getReasoningHeader = () => {
            if (!reasoningText) return "Thinking...";
            if (isStreaming && isLastReasoningPart) {
                const matches = [...reasoningText.matchAll(/\*\*(.*?)\*\*/g)];
                if (matches.length > 0) {
                    const lastMatch = matches[matches.length - 1];
                    if (lastMatch && lastMatch[1]) {
                        return lastMatch[1].trim();
                    }
                }
                return "Thinking...";
            }
            return "Thought";
        };

        return (
            <ReasoningSection
                key={key}
                header={getReasoningHeader()}
                content={reasoningText}
                isStreaming={isStreaming && isLastReasoningPart}
            />
        );
    }

    // Tool call parts
    if (part.type === 'tool-call' || part.type === 'tool-invocation' || part.type?.startsWith('tool-')) {
        const toolName = part.toolName || part.type.replace('tool-', '');
        const result = part.result || part.output;
        const state = part.state || (result !== undefined ? 'result' : 'call');
        const isDone = state === 'result' || result !== undefined;

        return (
            <div key={key} className="w-full py-0.5">
                <div className="flex items-center gap-2 text-muted-foreground text-xs select-none pl-0.5">
                    {!isDone && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground/70" />}
                    <span className={cn(
                        "font-medium text-[12px]",
                        !isDone ? "opacity-90" : "opacity-70"
                    )}>
                        {getToolDisplayName(toolName, result, state, agentName)}
                    </span>
                </div>
            </div>
        );
    }

    // Step start parts (can show as a subtle indicator)
    if (part.type === 'step-start') {
        return null; // Or render a subtle divider if desired
    }

    return null;
}

// Collapsible reasoning section component
function ReasoningSection({
    header,
    content,
    isStreaming
}: {
    header: string;
    content: string;
    isStreaming: boolean;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-xs py-1 select-none"
                disabled={!content}
            >
                <span className={cn(
                    "font-medium text-[12px] flex items-center gap-1",
                    isStreaming ? "opacity-90" : "opacity-70"
                )}>
                    {header === "Thinking..." ? (
                        <>
                            Thinking
                            <span className="flex gap-0.5">
                                <span className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }}>.</span>
                                <span className="animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }}>.</span>
                            </span>
                        </>
                    ) : (
                        header
                    )}
                </span>
                {content && (
                    <ChevronRight className={cn(
                        "h-3 w-3 opacity-50 transition-transform",
                        isExpanded && "rotate-90"
                    )} />
                )}
            </button>

            {isExpanded && content && (
                <div className="ml-1 pl-4 border-l-2 border-muted/30 my-1 text-xs text-muted-foreground/90">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={MarkdownComponents}
                    >
                        {content}
                    </ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export function CoworkerMessage({
    role,
    content,
    parts,
    isStreaming,
    agentName,
}: CoworkerMessageProps) {
    const isUser = role === "user";
    const { isExpanded } = useCoworkerConfig();

    // For user messages, render content directly
    if (isUser) {
        let displayContent = content;

        // 1. Strip Context Block
        const contextRegex = /^\s*\[Context:[\s\S]*?answering:\]([\s\S]*?)\n\n/;
        const contextMatch = displayContent.match(contextRegex);
        displayContent = displayContent.replace(contextRegex, "");

        // 2. File Attachments
        const fileRegex = /\[File: (.*?)\]\((.*?)\)\n*/g;
        const attachedFiles: { name: string, url: string }[] = [];
        const fileMatches = [...displayContent.matchAll(fileRegex)];
        fileMatches.forEach(m => {
            if (m[1] && m[2]) attachedFiles.push({ name: m[1], url: m[2] });
        });
        displayContent = displayContent.replace(fileRegex, "");

        // 3. System Time Block
        const systemRegex = /\[System: Local Time:[\s\S]*?\]\n*/g;
        displayContent = displayContent.replace(systemRegex, "");

        displayContent = displayContent.trim();

        // Extract Context Titles
        const contextTitles: string[] = [];
        if (contextMatch && contextMatch[1]) {
            const matches = [...contextMatch[1].matchAll(/- (.*?) \(ID:/g)];
            matches.forEach(m => {
                if (m[1]) contextTitles.push(m[1].trim());
            });
        }

        return (
            <div className="flex w-full gap-2 justify-end">
                <div className="flex flex-col gap-1.5 max-w-[85%] items-end">
                    {displayContent && (
                        <div
                            className={cn(
                                "px-3.5 py-2.5 rounded-2xl rounded-tr-md text-sm leading-relaxed",
                                isExpanded
                                    ? "bg-white dark:bg-zinc-800 shadow-sm text-foreground"
                                    : "bg-muted/80 text-foreground"
                            )}
                        >
                            <div className="whitespace-pre-wrap break-words">
                                {displayContent}
                            </div>
                        </div>
                    )}

                    {/* Render Attached Files */}
                    {attachedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-end mt-0.5">
                            {attachedFiles.map((file, i) => (
                                <a
                                    key={i}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded-full border flex items-center gap-1 opacity-80 max-w-[140px] select-none hover:opacity-100 transition-opacity hover:underline"
                                >
                                    <Paperclip className="h-2.5 w-2.5 opacity-70 flex-shrink-0" />
                                    <span className="truncate">{file.name}</span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Render Context Docs */}
                    {contextTitles.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-end mt-0.5">
                            {contextTitles.map((title, i) => (
                                <div key={i} className="text-[10px] bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded-full border flex items-center gap-1 opacity-80 max-w-[140px] select-none hover:opacity-100 transition-opacity">
                                    <FileText className="h-2.5 w-2.5 opacity-70 flex-shrink-0" />
                                    <span className="truncate">{title}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // For assistant messages, render parts in order
    // Find the last reasoning part index for streaming indicator
    let lastReasoningIndex = -1;
    parts.forEach((part, i) => {
        if (part.type === 'reasoning') {
            lastReasoningIndex = i;
        }
    });

    // If no parts but has content, create a text part
    const effectiveParts = parts.length > 0 ? parts : (content ? [{ type: 'text', text: content }] : []);

    // Show thinking placeholder if streaming with no content yet
    const showThinkingPlaceholder = isStreaming && effectiveParts.length === 0;

    return (
        <div className="flex w-full gap-2 justify-start">
            <div className="flex flex-col gap-1.5 w-full pr-1">
                {showThinkingPlaceholder && (
                    <ReasoningSection
                        header="Thinking..."
                        content=""
                        isStreaming={true}
                    />
                )}

                {effectiveParts.map((part, index) =>
                    renderPart(part, index, isStreaming || false, index === lastReasoningIndex, agentName)
                )}
            </div>
        </div>
    );
}
