"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { Id } from "@/convex/_generated/dataModel";

/**
 * Custom hook for uploading files with storage tracking.
 * Automatically tracks storage usage per user with a 25MB limit.
 */
export const useTrackedUpload = () => {
    const { edgestore } = useEdgeStore();
    const { userId } = useAuth();
    const addStorageUsage = useMutation(api.storage.addStorageUsage);
    const removeStorageUsage = useMutation(api.storage.removeStorageUsage);
    const saveFile = useMutation(api.files.save);
    const removeFile = useMutation(api.files.remove);

    /**
     * Upload a file with storage tracking
     */
    const uploadFile = useCallback(
        async (
            file: File,
            options?: {
                replaceTargetUrl?: string;
                documentId?: Id<"documents">;
            }
        ) => {
            try {
                const res = await edgestore.publicFiles.upload({
                    file,
                    input: { userId: userId ?? undefined },
                    options: options?.replaceTargetUrl
                        ? { replaceTargetUrl: options.replaceTargetUrl }
                        : undefined,
                });

                // Track storage usage after successful upload
                if (userId) {
                    await addStorageUsage({
                        userId,
                        bytes: res.size,
                    });

                    await saveFile({
                        name: file.name,
                        type: file.type,
                        url: res.url,
                        userId,
                        size: res.size,
                        documentId: options?.documentId,
                    });
                }

                return res;
            } catch (error) {
                console.error("Full upload error object:", error);

                let errorMessage = "Failed to upload file";

                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                // Fallback for objects that might look like errors but aren't instances of Error
                if (typeof error === "object" && error !== null && "message" in error) {
                    errorMessage = (error as any).message;
                }

                toast.error(errorMessage, { duration: 4000 });
                throw error;
            }
        },
        [edgestore, userId, addStorageUsage, saveFile]
    );

    /**
     * Delete a file with storage tracking
     */
    const deleteFile = useCallback(
        async (url: string) => {
            let size = 0;
            try {
                // Fetch file size to update storage usage
                const head = await fetch(url, { method: "HEAD" });
                const contentLength = head.headers.get("Content-Length");
                if (contentLength) {
                    size = parseInt(contentLength, 10);
                }
            } catch (err) {
                console.error("Failed to get file size before deletion:", err);
            }

            await edgestore.publicFiles.delete({ url });

            if (userId) {
                if (size > 0) {
                    await removeStorageUsage({
                        userId,
                        bytes: size,
                    });
                }
                await removeFile({ url, userId });
            }
        },
        [edgestore, userId, removeStorageUsage, removeFile]
    );

    return {
        uploadFile,
        deleteFile,
        userId,
    };
};
