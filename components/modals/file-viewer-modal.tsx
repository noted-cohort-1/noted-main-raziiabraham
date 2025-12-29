"use client";

import { FileIcon, X, Download, ExternalLink, Calendar, HardDrive } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

interface FileViewerModalProps {
    file: {
        _id: Id<"files">;
        name: string;
        url: string;
        type: string;
        size: number;
        createdAt: number;
        documents?: {
            _id: Id<"documents">;
            title: string;
        }[] | null;
    } | null;
    onClose: () => void;
}

export const FileViewerModal = ({ file, onClose }: FileViewerModalProps) => {
    if (!file) return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative flex h-[90vh] w-[95vw] overflow-hidden rounded-lg bg-background shadow-2xl md:h-[85vh] md:w-[90vw] lg:w-[80vw]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button (Absolute for mobile overlapping, or top right of container) */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 z-50 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 md:hidden"
                >
                    <X size={20} />
                </button>

                <div className="flex h-full w-full flex-col md:flex-row">
                    {/* LEFT: Media Preview (75%) */}
                    <div className="flex bg-black items-center justify-center p-4 md:h-full md:w-3/4 md:border-r border-white/10">
                        {file.type.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={file.url}
                                alt={file.name}
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : file.type.startsWith("video/") ? (
                            <video
                                src={file.url}
                                controls
                                autoPlay
                                className="max-h-full max-w-full"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-white/80">
                                <FileIcon size={64} className="mb-4" />
                                <p className="text-lg">Preview not available</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Info Sidebar (25%) */}
                    <div className="flex flex-col bg-background md:h-full md:w-1/4">
                        {/* Header / Top Bar for Desktop Close */}
                        <div className="flex items-center justify-between border-b p-4">
                            <h2 className="text-lg font-semibold truncate" title={file.name}>
                                {file.name}
                            </h2>
                            <button
                                onClick={onClose}
                                className="hidden rounded-full p-1 hover:bg-secondary md:block"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">

                            {/* Metadata Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Details
                                </h3>

                                <div className="flex items-center gap-3 text-sm">
                                    <HardDrive size={16} className="text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <span className="text-xs text-muted-foreground">Size</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <FileIcon size={16} className="text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{file.type}</span>
                                        <span className="text-xs text-muted-foreground">Type</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={16} className="text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {format(new Date(file.createdAt), "PPP p")}
                                        </span>
                                        <span className="text-xs text-muted-foreground">Uploaded</span>
                                    </div>
                                </div>
                            </div>

                            <hr />

                            {/* Used In Section (List) */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Used in
                                </h3>
                                {file.documents && file.documents.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        {file.documents.map((doc) => (
                                            <Link
                                                key={doc._id}
                                                href={`/documents/${doc._id}`}
                                                className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-secondary transition-colors group"
                                            >
                                                <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary" />
                                                <span className="font-medium underline decoration-transparent group-hover:decoration-primary underline-offset-4 transition-all">
                                                    {doc.title}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        Not linked to any document.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-4 border-t bg-secondary/20">
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Download size={16} />
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
