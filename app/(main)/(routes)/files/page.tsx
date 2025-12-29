"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import Image from "next/image";
import { FileIcon, VideoIcon } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { FileViewerModal } from "@/components/modals/file-viewer-modal";

/**
 * Page to display all uploaded files.
 */
const FilesPage = () => {
    const { userId } = useAuth();
    const files = useQuery(api.files.get, userId ? { userId } : "skip");
    const storage = useQuery(api.storage.getStorageUsage, userId ? { userId } : "skip");
    const [viewingFile, setViewingFile] = useState<any>(null);

    if (files === undefined || storage === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    // Calculate percentage for progress bar
    const storageUsedMB = (storage.bytesUsed / 1024 / 1024).toFixed(2);
    const storageLimitMB = (storage.limit / 1024 / 1024).toFixed(0);
    const storagePercent = Math.min(100, (storage.bytesUsed / storage.limit) * 100);

    if (files === null || files.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
                <Image
                    src="/empty-files-v3.svg"
                    alt="No files"
                    height="300"
                    width="400"
                    priority
                    className="h-auto dark:hidden"
                />
                <Image
                    src="/empty-files-v3-dark.svg"
                    alt="No files"
                    height="300"
                    width="400"
                    priority
                    className="hidden h-auto dark:block"
                />
                <p className="text-lg font-medium text-muted-foreground">
                    No files uploaded yet.
                </p>
                <div className="w-[300px] space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{storageUsedMB} MB of {storageLimitMB} MB used</span>
                        <span>{storagePercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={storagePercent} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">
                    Upload files in your documents to see them here.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex-col p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Files</h1>
                <div className="w-[200px] space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{storageUsedMB} MB of {storageLimitMB} MB used</span>
                        <span>{storagePercent.toFixed(0)}%</span>
                    </div>
                    <Progress value={storagePercent} className="h-2" />
                </div>
            </div>

            {/* Masonry-like Layout using CSS Columns */}
            <div className="columns-2 gap-4 space-y-4 sm:columns-3 md:columns-4 lg:columns-5">
                {files.map((file: any) => (
                    <div
                        key={file._id}
                        onClick={() => setViewingFile(file)}
                        className="group relative break-inside-avoid overflow-hidden rounded-xl border bg-secondary/50 transition-all hover:bg-secondary hover:shadow-md cursor-pointer"
                    >
                        {file.type.startsWith("image/") ? (
                            <img
                                src={file.url}
                                alt={file.name}
                                className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        ) : file.type.startsWith("video/") ? (
                            <div className="flex aspect-video w-full items-center justify-center bg-black/5">
                                <VideoIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center bg-muted">
                                <FileIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                        )}
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <p className="truncate text-sm font-medium text-white">{file.name}</p>
                            <p className="text-xs text-white/80">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* File Viewer Modal Overlay */}
            {/* File Viewer Modal Overlay */}
            <FileViewerModal
                file={viewingFile}
                onClose={() => setViewingFile(null)}
            />
        </div>
    );
};

export default FilesPage;
