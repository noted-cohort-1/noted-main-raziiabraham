"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import crypto from "crypto";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

function getEncryptionKey(): string {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY environment variable is not set");
  }
  return key;
}

function encrypt(text: string): string {
  const key = getEncryptionKey();
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const derivedKey = crypto.scryptSync(key, salt as any, 32);
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    derivedKey as any,
    iv as any,
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return salt.toString("hex") + iv.toString("hex") + tag.toString("hex") + encrypted;
}

function decrypt(encryptedText: string): string {
  const key = getEncryptionKey();
  const salt = Buffer.from(encryptedText.slice(0, SALT_LENGTH * 2), "hex");
  const iv = Buffer.from(
    encryptedText.slice(SALT_LENGTH * 2, TAG_POSITION * 2),
    "hex",
  );
  const tag = Buffer.from(
    encryptedText.slice(TAG_POSITION * 2, ENCRYPTED_POSITION * 2),
    "hex",
  );
  const encrypted = encryptedText.slice(ENCRYPTED_POSITION * 2);

  const derivedKey = crypto.scryptSync(key, salt as any, 32);
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    derivedKey as any,
    iv as any,
  );
  decipher.setAuthTag(tag as any);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Helper function to fetch models from OpenAI REST API
async function fetchOpenAIModels(apiKey: string): Promise<Array<{ id: string; created: number }>> {
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const models = data.data || [];

  // Filter for GPT models and return in the expected format
  return models
    .filter((model: { id: string }) => {
      const id = model.id.toLowerCase();
      return id.startsWith("gpt");
    })
    .map((model: { id: string; created: number }) => ({
      id: model.id,
      created: model.created,
    }));
}

export const saveSettings = action({
  args: {
    provider: v.string(),
    apiKey: v.string(),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const encryptedKey = encrypt(args.apiKey);
    const now = Date.now();

    const existing = await ctx.runQuery(api.aiSettings.getSettings);

    if (existing) {
      await ctx.runMutation(internal.aiSettings.updateSettings, {
        id: existing._id,
        encryptedKey,
        model: args.model,
        updatedAt: now,
      });
    } else {
      await ctx.runMutation(internal.aiSettings.createSettings, {
        userId,
        provider: args.provider,
        encryptedKey,
        model: args.model,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const testConnection = action({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    try {
      // Test connection by fetching models
      await fetchOpenAIModels(args.apiKey);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const getAvailableModels = action({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    try {
      const models = await fetchOpenAIModels(args.apiKey);
      return { success: true, models };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

export const getDecryptedApiKey = action({
  handler: async (ctx): Promise<{
    apiKey: string;
    model: string | undefined;
    provider: string;
  }> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const settings = await ctx.runQuery(api.aiSettings.getSettings);

    if (!settings) {
      throw new Error("AI settings not found");
    }

    const fullSettings: {
      _id: string;
      userId: string;
      provider: string;
      apiKey: string;
      model?: string;
      createdAt: number;
      updatedAt: number;
    } | null = await ctx.runQuery(internal.aiSettings.getSettingsWithKey);

    if (!fullSettings) {
      throw new Error("AI settings not found");
    }

    const decryptedKey = decrypt(fullSettings.apiKey);

    return {
      apiKey: decryptedKey,
      model: fullSettings.model,
      provider: fullSettings.provider,
    };
  },
});

export const loadSavedModels = action({
  handler: async (ctx): Promise<{
    success: boolean;
    models?: Array<{ id: string; created: number }>;
    selectedModel?: string;
    error?: string;
  }> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const settings = await ctx.runQuery(api.aiSettings.getSettings);

    if (!settings) {
      return { success: false, error: "No saved settings" };
    }

    const fullSettings: {
      _id: string;
      userId: string;
      provider: string;
      apiKey: string;
      model?: string;
      createdAt: number;
      updatedAt: number;
    } | null = await ctx.runQuery(internal.aiSettings.getSettingsWithKey);

    if (!fullSettings) {
      return { success: false, error: "Settings not found" };
    }

    try {
      const decryptedKey = decrypt(fullSettings.apiKey);
      const models = await fetchOpenAIModels(decryptedKey);

      return {
        success: true,
        models,
        selectedModel: fullSettings.model,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});
