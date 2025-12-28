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

/**
 * Test API key connection for different providers
 */
async function testProviderConnection(provider: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    switch (provider) {
      case "openai": {
        const response = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          return { success: false, error: error.error?.message || `OpenAI API error: ${response.statusText}` };
        }
        return { success: true };
      }
      case "anthropic": {
        // Anthropic uses a different header format
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-latest",
            max_tokens: 1,
            messages: [{ role: "user", content: "Hi" }],
          }),
        });
        // 400 is expected for minimal request, but auth errors are 401/403
        if (response.status === 401 || response.status === 403) {
          const error = await response.json().catch(() => ({}));
          return { success: false, error: error.error?.message || "Invalid Anthropic API key" };
        }
        return { success: true };
      }
      case "google": {
        // Google Gemini API test
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        );
        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          return { success: false, error: error.error?.message || `Google API error: ${response.statusText}` };
        }
        return { success: true };
      }
      default:
        return { success: false, error: `Unknown provider: ${provider}` };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

export const saveSettings = action({
  args: {
    provider: v.string(), // The provider we are configuring/saving
    apiKey: v.optional(v.string()), // Optional, if empty we might just be setting active provider
    model: v.optional(v.string()), // Optional, if empty we might just be setting active provider
    makeActive: v.optional(v.boolean()), // Whether to set this as the active provider
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;
    const now = Date.now();
    const existing = await ctx.runQuery(api.aiSettings.getSettings);

    const updateFields: any = { updatedAt: now };

    // If apiKey is provided, encrypt and save it for the specific provider
    if (args.apiKey) {
      const encryptedKey = encrypt(args.apiKey);
      if (args.provider === "openai") updateFields.openaiKey = encryptedKey;
      if (args.provider === "anthropic") updateFields.anthropicKey = encryptedKey;
      if (args.provider === "google") updateFields.googleKey = encryptedKey;
    }

    // Set active provider if requested or if it's the first time
    if (args.makeActive || !existing) {
      updateFields.activeProvider = args.provider;
      if (args.model) updateFields.activeModel = args.model;
    } else if (existing && existing.provider === args.provider && args.model) {
      // If updating the currently active provider's model
      updateFields.activeModel = args.model;
    }

    if (existing) {
      await ctx.runMutation(internal.aiSettings.updateSettings, {
        id: existing._id,
        ...updateFields,
      });
    } else {
      // Initial creation
      await ctx.runMutation(internal.aiSettings.createSettings, {
        userId,
        activeProvider: args.provider,
        activeModel: args.model,
        // Set the keys if provided
        openaiKey: args.provider === "openai" && args.apiKey ? encrypt(args.apiKey) : undefined,
        anthropicKey: args.provider === "anthropic" && args.apiKey ? encrypt(args.apiKey) : undefined,
        googleKey: args.provider === "google" && args.apiKey ? encrypt(args.apiKey) : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

export const testConnection = action({
  args: {
    provider: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    return await testProviderConnection(args.provider, args.apiKey);
  },
});

export const getDecryptedApiKey = action({
  args: {
    provider: v.optional(v.string()), // Optional, if not provided will use active
  },
  handler: async (ctx, args): Promise<{
    apiKey: string;
    model: string | undefined;
    provider: string;
  }> => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const settings = await ctx.runQuery(api.aiSettings.getSettings);

    if (!settings) {
      throw new Error("AI settings not found");
    }

    const fullSettings = await ctx.runQuery(internal.aiSettings.getSettingsWithKeys);

    if (!fullSettings) {
      throw new Error("AI settings not found");
    }

    // Determine which provider to use
    const targetProvider = args.provider || fullSettings.activeProvider;

    // Get the key for that provider
    let encryptedKey: string | undefined;
    if (targetProvider === "openai") encryptedKey = fullSettings.openaiKey;
    else if (targetProvider === "anthropic") encryptedKey = fullSettings.anthropicKey;
    else if (targetProvider === "google") encryptedKey = fullSettings.googleKey;

    if (!encryptedKey) {
      throw new Error(`No API key configured for ${targetProvider}`);
    }

    const decryptedKey = decrypt(encryptedKey);

    return {
      apiKey: decryptedKey,
      model: fullSettings.activeModel,
      provider: targetProvider || "openai", // Default to openai if not set
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
    return { success: true };
  },
});
