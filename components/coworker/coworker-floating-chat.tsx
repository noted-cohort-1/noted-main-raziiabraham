"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useCoworkerConfig } from "@/hooks/use-coworker-config";
import { CoworkerChat } from "./coworker-chat";
import { Button } from "@/components/ui/button";
import {
    X,
    Sparkles,
    ChevronDown,
    Expand,
    Minimize2, // Replaced Reduce with Minimize2
    SquarePen,
    Paperclip,
    ArrowUp,
    Pen,
    AtSign,
    Loader2,
    PanelRight,
    ChevronsRight,
    Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useTrackedUpload } from "@/hooks/use-tracked-upload";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { CoworkerContextSelector } from "@/components/coworker/coworker-context-selector";
import { AgentSlashCommand } from "./agent-slash-command";
import { trackCoworkerMessageSent } from "@/lib/analytics";

const getMessageLengthBucket = (message: string) => {
    const length = message.trim().length;
    if (length < 100) return "<100";
    if (length <= 500) return "100-500";
    return "500+";
};

export function CoworkerFloatingChat() {
    const { getToken } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const {
        isExpanded,
        setExpanded,
        sidebarWidth,
        setSidebarWidth,
        isResizing,
        setIsResizing,
    } = useCoworkerConfig();
    const [sourceScope, setSourceScope] = useState<"all" | "selection">("all");

    // Agent Selection State
    const [activeAgent, setActiveAgent] = useState<any>(null);
    const [isAgentCommandOpen, setIsAgentCommandOpen] = useState(false);

    // The floating chat represents the general squad unless an agent is specifically addressed in input
    const coworkerName = "AI Squad";

    // Resizing Right Sidebar
    const isResizingRightRef = useRef(false);

    const handleMouseDownRight = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.preventDefault();
        event.stopPropagation();

        isResizingRightRef.current = true;
        setIsResizing(true);
        document.addEventListener("mousemove", handleMouseMoveRight);
        document.addEventListener("mouseup", handleMouseUpRight);
    };

    const handleMouseMoveRight = (e: MouseEvent) => {
        if (!isResizingRightRef.current) return;
        let newWidth = window.innerWidth - e.clientX;

        if (newWidth < 280) newWidth = 280;
        if (newWidth > 600) newWidth = 600;

        setSidebarWidth(newWidth);
    };

    const handleMouseUpRight = () => {
        isResizingRightRef.current = false;
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMoveRight);
        document.removeEventListener("mouseup", handleMouseUpRight);
    };

    // File Upload
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile } = useTrackedUpload();
    const [isUploading, setIsUploading] = useState(false);

    // Load messages from Convex
    const savedMessages = useQuery(api.coworkerMessages.getMessages, { limit: 50 });
    const savedAiSettings = useQuery(api.aiSettings.getSettings);
    const addMessageMutation = useMutation(api.coworkerMessages.addMessage);
    const clearHistoryMutation = useMutation(api.coworkerMessages.clearHistory);

    // AI SDK useChat
    // AI SDK useChat
    const {
        messages,
        sendMessage,
        status,
        setMessages,
    } = useChat({
        transport: new DefaultChatTransport({
            api: "/api/ai/coworker",
        }),
        // @ts-ignore
        body: {
            agentId: activeAgent?._id
        },
        onFinish: async ({ message }: any) => {
            // Save assistant message to Convex on finish
            const parts = message.parts || [];
            const textPart = parts.find((p: any) => p.type === 'text');
            const content = textPart?.text || message.content || "";

            // Extract reasoning tokens
            const reasoning = parts
                .filter((p: any) => p.type === 'reasoning')
                .map((p: any) => p.reasoning)
                .join("");

            // Save if there's any content, reasoning, or tool invocations
            if (content || reasoning || (message.toolInvocations && message.toolInvocations.length > 0)) {
                await addMessageMutation({
                    role: "assistant",
                    content: content,
                    reasoning: reasoning,
                    toolInvocations: message.toolInvocations,
                    parts: message.parts
                });
            }
        },
    });

    // Manual input state
    const [input, setInput] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInput(value);

        // Detect '/' at start of input or on a new line to open command menu
        if (value === "/" || value.endsWith("\n/")) {
            setIsAgentCommandOpen(true);
        } else if (isAgentCommandOpen && !value.includes("/")) {
            setIsAgentCommandOpen(false);
        }
    };

    const onSelectAgent = (agent: any) => {
        setActiveAgent(agent);
        // If agent is selected via slash command, clear the '/'
        if (input === "/") {
            setInput("");
        }
    };

    const isLoading = status === "submitted" || status === "streaming";

    // Sync messages from Convex on initial load
    useEffect(() => {
        if (savedMessages && messages.length === 0 && savedMessages.length > 0) {
            const mapped = savedMessages.map(m => {
                const messageData = m as any;

                // If parts exist in the database, use them to preserve exact order
                if (messageData.parts && messageData.parts.length > 0) {
                    return {
                        id: m._id,
                        role: m.role as "user" | "assistant",
                        parts: messageData.parts,
                        createdAt: new Date(m.createdAt),
                        toolInvocations: messageData.toolInvocations
                    };
                }

                // Fallback for older messages without parts
                return {
                    id: m._id,
                    role: m.role as "user" | "assistant",
                    parts: [
                        { type: 'text', text: messageData.content },
                        ...(messageData.reasoning ? [{ type: 'reasoning', reasoning: messageData.reasoning }] : [])
                    ],
                    createdAt: new Date(m.createdAt),
                    toolInvocations: messageData.toolInvocations
                };
            });
            setMessages(mapped as any);
        }
    }, [savedMessages, messages.length, setMessages]);

    // Context Selection State
    const [isContextSelectorOpen, setIsContextSelectorOpen] = useState(false);
    interface ContextDoc {
        id: string;
        title: string;
        icon?: string;
    }
    const [contextDocs, setContextDocs] = useState<ContextDoc[]>([]);

    // Context Handlers
    const onContextSelect = (id: string, title: string, icon?: string) => {
        // Prevent duplicates
        if (contextDocs.some(doc => doc.id === id)) return;
        setContextDocs(prev => [...prev, { id, title, icon }]);
    };

    const removeContextDoc = (id: string) => {
        setContextDocs(prev => prev.filter(doc => doc.id !== id));
    };

    // File Attachment State
    interface AttachedFile {
        name: string;
        url: string;
        type: string;
        file?: File;
    }
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

    const removeAttachedFile = (url: string) => {
        setAttachedFiles(prev => prev.filter(f => f.url !== url));
    };

    // Helper to convert file to base64
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                // Strip the data: content type prefix to get raw base64
                const base64 = result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    // Custom submit handler to save user message and handle uploads
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const safeInput = input || "";
        // Allow submit if there is text OR attached files
        if ((!safeInput.trim() && attachedFiles.length === 0) || isLoading) return;

        let userContent = safeInput;

        // Add time context
        userContent = `[System: Local Time: ${new Date().toLocaleString()}]\n\n${userContent}`;

        // Prepend attached files
        if (attachedFiles.length > 0) {
            const fileLinks = attachedFiles.map(f => `[File: ${f.name}](${f.url})`).join('\n');
            userContent = fileLinks + "\n\n" + userContent;
        }

        // Prepend context instructions if any documents are selected
        if (contextDocs.length > 0) {
            const contextInstruction = `\n\n[Context: The user has attached the following documents. Please read them first using the readDocument tool before answering:]\n${contextDocs.map(doc => `- ${doc.title} (ID: ${doc.id})`).join('\n')}\n\n`;
            userContent = contextInstruction + userContent;
        }

        setInput(""); // Clear immediately
        setContextDocs([]); // Clear context after sending
        setAttachedFiles([]); // Clear files after sending

        const userParts: any[] = [{ type: 'text', text: userContent }];

        // Add attachment parts for multimodal processing
        attachedFiles.forEach(file => {
            if (file.type.startsWith('image/')) {
                userParts.push({ type: 'image', image: file.url });
            } else {
                // For PDFs and other files, send as file part
                userParts.push({ type: 'file', data: file.url, mimeType: file.type });
            }
        });

        // Save user message to Convex
        await addMessageMutation({
            role: "user",
            content: userContent,
            parts: userParts,
            agentId: activeAgent?._id // Tag message with active agent
        });

        trackCoworkerMessageSent({
            ai_provider: savedAiSettings?.provider ?? "unknown",
            message_length_bucket: getMessageLengthBucket(safeInput),
            squad_agent_id: activeAgent?._id,
            document_id: contextDocs[0]?.id,
        });

        // Generate response using sendMessage which calls the API
        sendMessage({
            role: "user",
            parts: userParts as any,
        });
    };

    const handleClearHistory = async () => {
        await clearHistoryMutation();
        setMessages([]);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error("Only JPG, PNG, and PDF files are supported");
            return;
        }

        setIsUploading(true);
        try {
            const result = await uploadFile(file);
            setAttachedFiles(prev => [...prev, { name: file.name, url: result.url, type: file.type }]);
            toast.success("File attached");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload file");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // Toggle Chat visibility
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-lg border transition-transform hover:scale-105 active:scale-95"
                aria-label="Open AI Squad"
            >
                <Bot className="h-5 w-5 text-foreground" />
            </button>
        );
    }

    // Dynamic styles for Sidebar Mode
    const containerClasses = cn(
        "z-[400] flex flex-col", // Removed overflow-hidden to allow popovers to stick out
        isExpanded ? "bg-secondary" : "bg-background",
        !isResizing && "transition-all duration-300 ease-in-out",
        isExpanded
            ? "h-full relative" // Sidebar mode: Relative in flex container, no rounding, no border
            : "fixed bottom-6 right-6 h-[600px] w-[400px] rounded-2xl border shadow-2xl" // Floating mode
    );

    return (
        <div
            className={containerClasses}
            style={isExpanded ? { width: `${sidebarWidth}px` } : {}}
        >
            {/* Resize Handle (Left side of sidebar) */}
            {isExpanded && (
                <div
                    onMouseDown={handleMouseDownRight}
                    className="absolute left-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition hover:opacity-100 z-50"
                />
            )}
            {/* Header */}
            <div className={cn(
                "flex items-center justify-between px-4 py-3 backdrop-blur z-10 sticky top-0",
                isExpanded ? "bg-secondary/95" : "bg-background/95 border-b"
            )}>
                <div className="flex items-center gap-2 px-2 py-1 rounded-md">
                    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-primary/10">
                        <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                        {coworkerName}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:bg-muted/50"
                        onClick={handleClearHistory}
                        title="New chat"
                    >
                        <SquarePen className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:bg-muted/50"
                        onClick={() => setExpanded(!isExpanded)}
                        title={isExpanded ? "Collapse panel" : "Dock to side"}
                    >
                        {isExpanded ? <ChevronsRight className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                    </Button>
                    {!isExpanded && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:bg-muted/50"
                            onClick={() => setIsOpen(false)}
                            title="Close"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col justify-center items-center text-center space-y-8 pb-10">
                        <div className="relative">
                            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center shadow-sm border mb-4 relative overflow-hidden">
                                <Bot className="h-8 w-8 text-primary" />
                                <div className="absolute -top-1 -right-1 z-10">
                                    <Sparkles className="h-4 w-4 text-orange-500 fill-orange-500" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold tracking-tight text-center">How can I help you today?</h2>
                    </div>
                ) : (
                    <CoworkerChat messages={messages as any} isStreaming={isLoading} />
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 pt-2">
                {/* Context Tags */}
                {contextDocs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 px-2">
                        {contextDocs.map(doc => (
                            <div key={doc.id} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs animate-in fade-in zoom-in border">
                                <span className="opacity-70">{doc.icon}</span>
                                <span className="font-medium max-w-[120px] truncate">{doc.title}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeContextDoc(doc.id); }}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Attached File Tags */}
                {attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 px-2">
                        {attachedFiles.map(file => (
                            <div key={file.url} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs animate-in fade-in zoom-in border">
                                <span className="opacity-70"><Paperclip className="h-3 w-3" /></span>
                                <span className="font-medium max-w-[120px] truncate">{file.name}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeAttachedFile(file.url); }}
                                    className="ml-1 hover:text-destructive"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form
                    onSubmit={onSubmit}
                    className="relative flex flex-col rounded-[24px] border bg-background shadow-lg ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-black/10 transition-all cursor-text"
                    onClick={() => document.querySelector<HTMLTextAreaElement>('textarea')?.focus()}
                >
                    {/* Agent Slash Command Popover - Inside form for relative positioning */}
                    <AgentSlashCommand
                        isOpen={isAgentCommandOpen}
                        onClose={() => setIsAgentCommandOpen(false)}
                        onSelect={onSelectAgent}
                    />

                    <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        value={input || ""}
                        onChange={handleInputChange}
                        placeholder={activeAgent ? `Message ${activeAgent.name}...` : "Ask anything ... or / for your agents"}
                        className={cn(
                            "w-full min-h-[40px] px-4 bg-transparent border-none resize-none focus:outline-none text-sm placeholder:text-muted-foreground/60 rounded-[24px]",
                            activeAgent ? "pt-2" : "pt-4"
                        )}
                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSubmit(e);
                            }
                        }}
                    />

                    <div className="flex items-center justify-between px-4 pb-3 pt-2">
                        <div className="flex items-center gap-3">
                            {/* File Upload */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                            <button
                                type="button"
                                className={cn(
                                    "text-muted-foreground hover:text-foreground transition-colors",
                                    attachedFiles.length > 0 && "text-primary hover:text-primary/80"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                disabled={isUploading}
                            >
                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4 transform -rotate-45" />}
                            </button>

                            {/* Context Selector */}
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 hover:bg-muted/50 rounded-md cursor-pointer transition-colors text-xs text-muted-foreground",
                                    contextDocs.length > 0 && "text-primary font-medium bg-primary/10 hover:bg-primary/20"
                                )}
                                onClick={(e) => { e.stopPropagation(); setIsContextSelectorOpen(true); }}
                            >
                                <AtSign className="h-3 w-3" />
                                <span>{contextDocs.length > 0 ? `${contextDocs.length} selected` : "Context"}</span>
                            </div>

                            {/* Agent Indicator Pill */}
                            {activeAgent && (
                                <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold animate-in fade-in zoom-in border border-primary/20">
                                    <span className="text-sm">{activeAgent.icon || "🤖"}</span>
                                    <span>{activeAgent.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveAgent(null);
                                        }}
                                        className="ml-1 hover:text-primary/70"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "h-8 w-8 rounded-full transition-all shadow-none",
                                (input || "").trim()
                                    ? "bg-black hover:bg-black/90 text-white"
                                    : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                            )}
                            disabled={!(input || "").trim() || isLoading}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </div>

            <CoworkerContextSelector
                isOpen={isContextSelectorOpen}
                onClose={() => setIsContextSelectorOpen(false)}
                onSelect={(id: any, title: string, icon?: string) => onContextSelect(id, title, icon)}
            />
        </div>
    );
}
