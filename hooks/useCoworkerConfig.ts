import { create } from "zustand";
import { Id } from "@/convex/_generated/dataModel";

interface CoworkerConfigStore {
    // Config state
    isLoading: boolean;
    isSaving: boolean;
    isActive: boolean;
    isExpanded: boolean;
    isResizing: boolean;
    sidebarWidth: number;
    hasConfig: boolean;
    instructionsDocId: Id<"documents"> | null;

    // Actions
    setLoading: (loading: boolean) => void;
    setSaving: (saving: boolean) => void;
    setActive: (active: boolean) => void;
    setExpanded: (expanded: boolean) => void;
    setIsResizing: (isResizing: boolean) => void;
    setSidebarWidth: (width: number) => void;
    setHasConfig: (hasConfig: boolean) => void;
    setInstructionsDocId: (id: Id<"documents"> | null) => void;
    reset: () => void;
}

export const useCoworkerConfig = create<CoworkerConfigStore>((set) => ({
    isLoading: true,
    isSaving: false,
    isActive: true,
    isExpanded: false,
    isResizing: false,
    sidebarWidth: 380, // Default width
    hasConfig: false,
    instructionsDocId: null,

    setLoading: (loading) => set({ isLoading: loading }),
    setSaving: (saving) => set({ isSaving: saving }),
    setActive: (active) => set({ isActive: active }),
    setExpanded: (expanded) => set({ isExpanded: expanded }),
    setIsResizing: (isResizing) => set({ isResizing }),
    setSidebarWidth: (width) => set({ sidebarWidth: width }),
    setHasConfig: (hasConfig) => set({ hasConfig }),
    setInstructionsDocId: (id) => set({ instructionsDocId: id }),

    reset: () =>
        set({
            isLoading: true,
            isSaving: false,
            isActive: true,
            isExpanded: false,
            isResizing: false,
            sidebarWidth: 380,
            hasConfig: false,
            instructionsDocId: null,
        }),
}));
