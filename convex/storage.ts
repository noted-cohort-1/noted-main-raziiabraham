import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 25MB limit per user in bytes
export const STORAGE_LIMIT_BYTES = 25 * 1024 * 1024;

/**
 * Get the current storage usage for a user
 */
export const getStorageUsage = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const storage = await ctx.db
            .query("userStorage")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();

        return {
            bytesUsed: storage?.bytesUsed ?? 0,
            limit: STORAGE_LIMIT_BYTES,
            remaining: STORAGE_LIMIT_BYTES - (storage?.bytesUsed ?? 0),
        };
    },
});

/**
 * Update storage usage after a file upload
 */
export const addStorageUsage = mutation({
    args: {
        userId: v.string(),
        bytes: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userStorage")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                bytesUsed: existing.bytesUsed + args.bytes,
                updatedAt: Date.now(),
            });
        } else {
            await ctx.db.insert("userStorage", {
                userId: args.userId,
                bytesUsed: args.bytes,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Reduce storage usage after a file deletion
 */
export const removeStorageUsage = mutation({
    args: {
        userId: v.string(),
        bytes: v.number(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userStorage")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();

        if (existing) {
            const newBytes = Math.max(0, existing.bytesUsed - args.bytes);
            await ctx.db.patch(existing._id, {
                bytesUsed: newBytes,
                updatedAt: Date.now(),
            });
        }
    },
});

/**
 * Check if user can upload a file of given size
 */
export const canUpload = query({
    args: {
        userId: v.string(),
        fileSize: v.number(),
    },
    handler: async (ctx, args) => {
        const storage = await ctx.db
            .query("userStorage")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .first();

        const currentUsage = storage?.bytesUsed ?? 0;
        const wouldExceed = currentUsage + args.fileSize > STORAGE_LIMIT_BYTES;

        return {
            allowed: !wouldExceed,
            currentUsage,
            limit: STORAGE_LIMIT_BYTES,
            remaining: STORAGE_LIMIT_BYTES - currentUsage,
            requestedSize: args.fileSize,
        };
    },
});
