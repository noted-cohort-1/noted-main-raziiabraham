"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { useMutation, useConvex } from "convex/react";
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
    // We can't use useQuery hook conditionally or inside callback easily for one-off checks.
    // So we'll use useConvex which allows imperative calls.
    const convex = useConvex();

    /**
     * Helper to calculate SHA-256 checksum of a file
     */
    const computeChecksum = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    /**
     * Upload a file with storage tracking
     */
    const uploadFile = useCallback(
        async (
            file: File,
            options?: {
                replaceTargetUrl?: string; // Legacy: used for replacement, might bypass dedupe
                documentId?: Id<"documents">;
            }
        ) => {
            try {
                if (!userId) throw new Error("Unauthorized");

                // 1. Compute Checksum
                const checksum = await computeChecksum(file);

                // 2. Check Backend for duplicates
                const checkResult = await convex.query(api.files.checkExists, {
                    checksum,
                    name: file.name,
                    userId
                });

                let finalFile = file;
                let finalName = file.name;
                let shouldUploadToEdgeStore = true;
                let existingUrl = "";

                // Case A: Exact Duplicate (Checksum Match)
                if (checkResult.checksumMatch) {
                    shouldUploadToEdgeStore = false;
                    existingUrl = checkResult.checksumMatch.url;
                    toast.info("File already exists in library. Using existing copy.");
                }
                // Case B: Name Collision (Content Differs)
                else if (checkResult.nameExists) {
                    // Simple renaming strategy: append (1), (2) etc.
                    // Ideally we'd loop check, but for MVP we'll try adding timestamp or random suffix to ensure uniqueness
                    // or just (1) implies we accept one level of collision handling. 
                    // Let's do a timestamp suffix to be safe and avoid multiple roundtrips for now.
                    // Or standard logic: name (1).ext

                    const nameParts = file.name.lastIndexOf(".");
                    const name = nameParts !== -1 ? file.name.substring(0, nameParts) : file.name;
                    const ext = nameParts !== -1 ? file.name.substring(nameParts) : "";

                    // Simple infinite loop protection: try up to 5 times or just use timestamp
                    // Let's use specific logic requested: (1), (2). 
                    // To do this correctly without racing, we'd need another check. 
                    // Let's just rename once to `Name (Copy).ext` or `Name (Timestamp).ext` to be safe?
                    // User asked for (1), (2).

                    let counter = 1;
                    let uniqueNameFound = false;
                    while (!uniqueNameFound && counter < 5) {
                        const candidateName = `${name} (${counter})${ext}`;
                        const nameCheck = await convex.query(api.files.checkExists, {
                            checksum: "skip", // we only care about name here
                            name: candidateName,
                            userId
                        });
                        if (!nameCheck.nameExists) {
                            finalName = candidateName;
                            uniqueNameFound = true;
                        }
                        counter++;
                    }

                    if (!uniqueNameFound) {
                        // Fallback to timestamp if still colliding
                        finalName = `${name} (${Date.now()})${ext}`;
                    }

                    finalFile = new File([file], finalName, { type: file.type });
                    toast.info(`Filename taken. Renamed to "${finalName}"`);
                }

                let url = existingUrl;
                let size = finalFile.size;

                if (shouldUploadToEdgeStore) {
                    const res = await edgestore.publicFiles.upload({
                        file: finalFile,
                        input: { userId: undefined }, // User ID handled by logic
                        options: options?.replaceTargetUrl
                            ? { replaceTargetUrl: options.replaceTargetUrl }
                            : undefined,
                    });
                    url = res.url;
                    size = res.size;

                    // Track storage usage after successful upload
                    await addStorageUsage({
                        userId,
                        bytes: size,
                    });
                }

                // Always save metadata (computes links)
                await saveFile({
                    name: finalName, // Use the (potentially new) name
                    type: finalFile.type,
                    url: url,
                    userId,
                    size: size,
                    documentId: options?.documentId,
                    checksum: checksum, // Save checksum!
                });

                return { url: url, size: size };
            } catch (error) {
                console.error("Full upload error object:", error);

                let errorMessage = "Failed to upload file";

                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                if (typeof error === "object" && error !== null && "message" in error) {
                    errorMessage = error instanceof Error ? error.message : String(error);
                }

                toast.error(errorMessage, { duration: 4000 });
                throw error;
            }
        },
        [edgestore, userId, addStorageUsage, saveFile, convex]
    );

    /**
     * Delete a file with storage tracking
     */
    const deleteFile = useCallback(
        async (url: string, documentId?: Id<"documents">) => {
            if (!userId) return;

            // 1. First, attempt to remove/unlink from our database
            // The backend return value tells us if it's safe to delete from cloud
            const shouldDeleteFromCloud = await removeFile({
                url,
                userId,
                documentId
            });

            if (shouldDeleteFromCloud) {
                // 2. Only if backend says it's fully removed, delete from EdgeStore
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

                try {
                    await edgestore.publicFiles.delete({ url });

                    // 3. Update storage usage (only if we actually deleted a file)
                    if (size > 0) {
                        await removeStorageUsage({
                            userId,
                            bytes: size,
                        });
                    }
                } catch (error) {
                    console.error("Failed to delete from EdgeStore:", error);
                    // Note: We already deleted from DB, so it's inconsistent state technically,
                    // but better to have orphan file in cloud than broken UI reference.
                    toast.error("File removed from list but failed to delete from cloud.");
                }
            } else {
                // Just unlinked from one document, file kept.
                toast.success("File removed from document.");
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
