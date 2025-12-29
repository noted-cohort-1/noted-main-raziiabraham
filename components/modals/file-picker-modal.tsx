"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFilePicker } from "@/hooks/use-file-picker";
import { FilePicker } from "@/components/file-picker";

export const FilePickerModal = () => {
    const filePicker = useFilePicker();

    const onSelect = (url: string) => {
        if (filePicker.onSelectCallback) {
            filePicker.onSelectCallback(url);
        }
        filePicker.onClose();
    };

    return (
        <Dialog open={filePicker.isOpen} onOpenChange={filePicker.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center font-bold">Select File</DialogTitle>
                </DialogHeader>
                <FilePicker onSelect={onSelect} />
            </DialogContent>
        </Dialog>
    );
};
