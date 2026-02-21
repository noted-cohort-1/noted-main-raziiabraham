"use client";

import Image from "next/image";

import { useRef, useEffect } from "react";
import { useCoworker, CoworkerMessage as CoworkerMessageType } from "@/hooks/useCoworker";
import { CoworkerMessage } from "./CoworkerMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCoworkerConfig } from "@/hooks/useCoworkerConfig";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Bot, Sparkles } from "lucide-react";

interface CoworkerChatProps {
    messages: CoworkerMessageType[];
    isStreaming?: boolean;
}

export function CoworkerChat({ messages, isStreaming }: CoworkerChatProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { instructionsDocId } = useCoworkerConfig();
    const instructionsDoc = useQuery(api.documents.getById, instructionsDocId ? { documentId: instructionsDocId } : "skip");
    const coworkerName = !instructionsDocId
        ? "AI Squad"
        : (instructionsDoc === undefined ? "..." : (
            instructionsDoc?.title === "Marketing Intelligence Specialist"
                ? "AI Squad"
                : (instructionsDoc?.title || "Untitled Squad")
        ));

    // Auto-scroll to bottom when new messages arrive or while streaming
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isStreaming]);

    if (messages.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border shadow-sm">
                    <Bot className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-1 font-medium">{coworkerName}</h3>
                <p className="text-sm text-muted-foreground">
                    I&apos;m here to help you work with your documents. Ask me to research information,
                    summarize your workspace, or create new content for you.
                </p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-full p-4">
            <div className="flex flex-col gap-3 pb-2">
                {messages.map((message) => {
                    // For user messages, extract content from parts or content field
                    if (message.role === "user") {
                        // User message content can be in parts[0].text or directly in content
                        const parts = (message as any).parts || [];
                        const textPart = parts.find((p: any) => p.type === 'text');
                        const userContent = textPart?.text || message.content || "";

                        return (
                            <CoworkerMessage
                                key={message.id}
                                role="user"
                                content={userContent}
                                parts={[]}
                                isStreaming={false}
                            />
                        );
                    }

                    // For assistant messages, pass raw parts for in-order rendering
                    const parts = (message as any).parts || [];
                    const toolInvocations = (message as any).toolInvocations || [];

                    // Merge toolInvocations into parts if they exist and aren't already in parts
                    // This handles cases where SDK provides toolInvocations separately
                    const enrichedParts = [...parts];

                    // If we have toolInvocations but no tool-call parts, add them
                    if (toolInvocations.length > 0) {
                        const hasToolParts = parts.some((p: any) =>
                            p.type === 'tool-call' || p.type?.startsWith('tool-')
                        );

                        if (!hasToolParts) {
                            // Add tool invocations as parts at the end (will be sorted by the component if needed)
                            toolInvocations.forEach((ti: any) => {
                                enrichedParts.push({
                                    type: 'tool-invocation',
                                    ...ti
                                });
                            });
                        }
                    }

                    return (
                        <CoworkerMessage
                            key={message.id}
                            role="assistant"
                            content={message.content || ""}
                            parts={enrichedParts}
                            isStreaming={isStreaming && message === messages[messages.length - 1]}
                        />
                    );
                })}

                {/* Show thinking placeholder when waiting for response */}
                {isStreaming && messages[messages.length - 1]?.role === "user" && (
                    <CoworkerMessage
                        key="thinking-placeholder"
                        role="assistant"
                        content=""
                        parts={[]}
                        isStreaming={true}
                    />
                )}

                {/* Scroll Anchor */}
                <div ref={bottomRef} className="h-px w-full" />
            </div>
        </ScrollArea>
    );
}
