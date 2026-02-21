import { create } from "zustand";

interface CoworkerConfigStore {
    // Config state
    isExpanded: boolean;
    isResizing: boolean;
    sidebarWidth: number;

    // Actions
    setExpanded: (expanded: boolean) => void;
    setIsResizing: (isResizing: boolean) => void;
    setSidebarWidth: (width: number) => void;
    reset: () => void;
}

export const useCoworkerConfig = create<CoworkerConfigStore>((set) => ({
    isExpanded: false,
    isResizing: false,
    sidebarWidth: 380, // Default width

    setExpanded: (expanded) => set({ isExpanded: expanded }),
    setIsResizing: (isResizing) => set({ isResizing }),
    setSidebarWidth: (width) => set({ sidebarWidth: width }),

    reset: () =>
        set({
            isExpanded: false,
            isResizing: false,
            sidebarWidth: 380,
        }),
}));
