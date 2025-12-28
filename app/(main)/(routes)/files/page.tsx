"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import Image from "next/image";
import { FileIcon, VideoIcon } from "lucide-react"; // Removed ImageIcon as it's not used directly anymore
import { useState } from "react";

/**
 * Page to display all uploaded files.
 */
const FilesPage = () => {
    const { userId } = useAuth();
    const files = useQuery(api.files.get, { userId: userId ?? undefined });
    const [viewingFile, setViewingFile] = useState<any>(null);

    if (files === undefined) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-muted-foreground">Loading files...</div>
            </div>
        );
    }

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
                <p className="text-sm text-muted-foreground">
                    Upload files in your documents to see them here.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex-col p-8 overflow-y-auto">
            <h1 className="mb-6 text-3xl font-bold">Files</h1>

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
            {viewingFile && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setViewingFile(null)}
                >
                    <div
                        className="relative flex max-h-[90vh] max-w-[95vw] flex-col items-center justify-center rounded-lg outline-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setViewingFile(null)}
                            className="absolute -right-12 -top-12 p-2 text-white/70 hover:text-white sm:right-0 sm:-top-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                        </button>

                        {/* Content */}
                        {viewingFile.type.startsWith("image/") ? (
                            <img
                                src={viewingFile.url}
                                alt={viewingFile.name}
                                className="max-h-[85vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
                            />
                        ) : viewingFile.type.startsWith("video/") ? (
                            <video
                                src={viewingFile.url}
                                controls
                                autoPlay
                                className="max-h-[85vh] w-auto max-w-full rounded-md shadow-2xl"
                            />
                        ) : (
                            <div className="flex h-96 w-80 flex-col items-center justify-center rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-neutral-900">
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                                    <FileIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <p className="mb-2 text-xl font-medium text-black dark:text-white break-all">{viewingFile.name}</p>
                                <p className="mb-8 text-sm text-neutral-500">
                                    {(viewingFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                                <a
                                    href={viewingFile.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                    onClick={() => setViewingFile(null)}
                                >
                                    Download / Open
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilesPage;
