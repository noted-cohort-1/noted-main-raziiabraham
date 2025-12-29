"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import { FileIcon, VideoIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilePickerProps {
    onSelect: (url: string, name: string) => void;
    selectedUrl?: string; // Optional: to highlight currently selected
}

/**
 * Reusable component to display a grid of files for selection.
 */
export const FilePicker = ({ onSelect, selectedUrl }: FilePickerProps) => {
    const { userId } = useAuth();
    const files = useQuery(api.files.get, { userId: userId ?? undefined });
    const [selectedId, setSelectedId] = useState<string | null>(null);

    if (files === undefined) {
        return (
            <div className="flex h-[200px] items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (files === null || files.length === 0) {
        return (
            <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground">
                <p>No files found.</p>
                <p className="text-xs">Upload some files in your documents first.</p>
            </div>
        );
    }

    return (
        <div className="grid max-h-[300px] grid-cols-3 gap-2 overflow-y-auto p-2">
            {files.map((file: any) => {
                const isSelected = selectedId === file._id || selectedUrl === file.url;

                return (
                    <div
                        key={file._id}
                        onClick={() => {
                            setSelectedId(file._id);
                            onSelect(file.url, file.name);
                        }}
                        className={cn(
                            "group relative cursor-pointer overflow-hidden rounded-md border-2 bg-secondary/50 transition-all hover:bg-secondary",
                            isSelected ? "border-primary" : "border-transparent"
                        )}
                    >
                        <div className="aspect-square w-full">
                            {file.type.startsWith("image/") ? (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : file.type.startsWith("video/") ? (
                                <div className="flex h-full w-full items-center justify-center bg-black/5">
                                    <VideoIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                    <FileIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1">
                            <p className="truncate text-[10px] text-white">{file.name}</p>
                        </div>

                        {isSelected && (
                            <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                                <Check className="h-3 w-3" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
