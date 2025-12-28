import { initEdgeStore } from "@edgestore/server";
import {
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { EdgeStoreError } from "@edgestore/shared";

// 25MB limit per user in bytes
const STORAGE_LIMIT_BYTES = 25 * 1024 * 1024;

// Initialize Convex HTTP client for storage tracking
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store buckets.
 * 
 * Storage tracking:
 * - beforeUpload: Checks if user has remaining storage quota
 * - Storage updates are done client-side after successful upload/delete
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket()
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .beforeUpload(async ({ input, fileInfo }) => {
      const fileSize = fileInfo.size;
      const userId = input.userId;

      if (!userId) {
        // Allow unauthenticated uploads but don't track them
        return true;
      }

      try {
        // Check if user can upload this file
        const result = await convex.query(api.storage.canUpload, {
          userId,
          fileSize,
        });

        if (!result.allowed) {
          const usedMB = (result.currentUsage / (1024 * 1024)).toFixed(2);
          const limitMB = (result.limit / (1024 * 1024)).toFixed(0);
          const remainingMB = (result.remaining / (1024 * 1024)).toFixed(2);

          throw new EdgeStoreError({
            message: `Storage limit exceeded. You've used ${usedMB}MB of ${limitMB}MB. ` +
              `Remaining: ${remainingMB}MB. Please delete some files to upload more.`,
            code: "BAD_REQUEST",
          });
        }

        return true;
      } catch (error) {
        if (error instanceof EdgeStoreError) {
          throw error;
        }

        console.error("Error checking storage limit:", error);
        // Allow upload if check fails (fail-open for better UX)
        return true;
      }
    })
    .beforeDelete(() => {
      // Always allow deletes
      return true;
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the type-safe client for the frontend.
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
