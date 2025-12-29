import { create } from "zustand";

type FilePickerStore = {
    isOpen: boolean;
    onOpen: (onSelect: (url: string) => void) => void;
    onClose: () => void;
    onSelectCallback?: (url: string) => void;
};

export const useFilePicker = create<FilePickerStore>((set) => ({
    isOpen: false,
    onOpen: (onSelect) => set({ isOpen: true, onSelectCallback: onSelect }),
    onClose: () => set({ isOpen: false, onSelectCallback: undefined }),
}));
