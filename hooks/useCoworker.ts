import { create } from "zustand";

export interface CoworkerMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: number;
}

interface CoworkerStore {
    // Chat state
    messages: CoworkerMessage[];
    isOpen: boolean;
    isLoading: boolean;
    isStreaming: boolean;
    error: string | null;

    // Actions
    setMessages: (messages: CoworkerMessage[]) => void;
    addMessage: (message: CoworkerMessage) => void;
    updateLastAssistantMessage: (content: string) => void;
    clearMessages: () => void;
    setOpen: (open: boolean) => void;
    toggle: () => void;
    setLoading: (loading: boolean) => void;
    setStreaming: (streaming: boolean) => void;
    setError: (error: string | null) => void;
}

export const useCoworker = create<CoworkerStore>((set) => ({
    messages: [],
    isOpen: false,
    isLoading: false,
    isStreaming: false,
    error: null,

    setMessages: (messages) => set({ messages }),

    addMessage: (message) =>
        set((state) => ({
            messages: [...state.messages, message],
        })),

    updateLastAssistantMessage: (content) =>
        set((state) => {
            const messages = [...state.messages];
            const lastIndex = messages.length - 1;
            if (lastIndex >= 0 && messages[lastIndex].role === "assistant") {
                messages[lastIndex] = { ...messages[lastIndex], content };
            }
            return { messages };
        }),

    clearMessages: () => set({ messages: [] }),

    setOpen: (open) => set({ isOpen: open }),

    toggle: () => set((state) => ({ isOpen: !state.isOpen })),

    setLoading: (loading) => set({ isLoading: loading }),

    setStreaming: (streaming) => set({ isStreaming: streaming }),

    setError: (error) => set({ error }),
}));
