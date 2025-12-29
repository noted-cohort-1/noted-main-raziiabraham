import { v } from "convex/values";
// Force sync
import { mutation, query } from "./_generated/server";

export const save = mutation({
    args: {
        name: v.string(),
        type: v.string(),
        url: v.string(),
        userId: v.string(),
        size: v.number(),
        documentId: v.optional(v.id("documents")),
        checksum: v.optional(v.string()), // [NEW]
    },
    handler: async (ctx, args) => {
        // Check if file already exists with same URL to prevent duplicates
        const existing = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("url"), args.url))
            .first();

        if (existing) {
            // If file exists, check if we need to add the documentId to the list
            if (args.documentId) {
                const existingDocIds = existing.documentIds || (existing.documentId ? [existing.documentId] : []);
                const isAlreadyLinked = existingDocIds.some(id => id === args.documentId);

                if (!isAlreadyLinked) {
                    await ctx.db.patch(existing._id, {
                        documentIds: [...existingDocIds, args.documentId],
                    });
                }
            }
            return existing._id;
        }

        const fileId = await ctx.db.insert("files", {
            ...args,
            documentIds: args.documentId ? [args.documentId] : [],
            createdAt: Date.now(),
        });

        return fileId;
    },
});

export const remove = mutation({
    args: {
        url: v.string(),
        userId: v.string(),
        documentId: v.optional(v.id("documents")), // [NEW] Optional document context
    },
    handler: async (ctx, args) => {
        const file = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("url"), args.url))
            .first();

        if (file) {
            // Case 1: Specific document removal requested
            if (args.documentId) {
                const docIds = file.documentIds || (file.documentId ? [file.documentId] : []);
                const updatedDocIds = docIds.filter(id => id !== args.documentId);

                // If the file is still used by other documents, just update the list
                if (updatedDocIds.length > 0) {
                    await ctx.db.patch(file._id, {
                        documentIds: updatedDocIds
                    });
                    return false; // NOT deleted from cloud, just unlinked
                }
            }

            // Case 2: No specific document (force delete) OR no documents left after unlink
            // Delete the file record entirely
            await ctx.db.delete(file._id);
            return true; // Deleted from DB, safe to delete from cloud
        }

        return false; // File not found
    },
});

export const get = query({
    args: {
        userId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        if (!args.userId) {
            return [];
        }

        const files = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId as string))
            .order("desc")
            .collect();

        const filesWithDocuments = await Promise.all(
            files.map(async (file) => {
                let documents: any[] = [];
                const docIds = file.documentIds || (file.documentId ? [file.documentId] : []);

                if (docIds.length > 0) {
                    const docs = await Promise.all(docIds.map((id) => ctx.db.get(id)));
                    documents = docs.filter((doc) => doc !== null);
                }

                return {
                    ...file,
                    documents, // Return array of docs
                };
            })
        );

        return filesWithDocuments;
    },
});

export const checkExists = query({
    args: {
        checksum: v.string(),
        name: v.string(),
        userId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        if (!args.userId) return { checksumMatch: null, nameExists: false };

        const checksumMatch = await ctx.db
            .query("files")
            .withIndex("by_checksum", (q) => q.eq("userId", args.userId as string).eq("checksum", args.checksum))
            .first();

        // Check for name collision (we only care if the name is taken, not by which file)
        // We do this separately because if checksum matches, we return early client-side
        // If checksum doesn't match, we might still need to rename.
        const nameMatch = await ctx.db
            .query("files")
            .withIndex("by_user", (q) => q.eq("userId", args.userId as string))
            .filter((q) => q.eq(q.field("name"), args.name))
            .first();

        return {
            checksumMatch,
            nameExists: !!nameMatch
        };
    }
});
