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

/**
 * Test a Relevance AI connection by making a server-side request.
 * Accepts pre-parsed region, projectId, and apiKey fields.
 */
export const testRelevanceConnection = action({
  args: {
    region: v.string(),
    projectId: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const response = await fetch(
      `https://api-${args.region.trim()}.stack.tryrelevance.com/latest/agents/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${args.projectId.trim()}:${args.apiKey.trim()}`,
        },
        body: JSON.stringify({ filters: [], page_size: 1 }),
      }
    );

    if (!response.ok) {
      const msg = await response.text().catch(() => response.statusText);
      throw new Error(`Connection failed: ${msg}`);
    }

    return { success: true };
  },
});

/**
 * Save a Relevance AI API key (encrypted).
 * Separate from saveSettings so it doesn't affect the active LLM provider.
 */
export const saveRelevanceKey = action({
  args: {
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const userId = identity.subject;
    const now = Date.now();
    const encryptedKey = encrypt(args.apiKey);
    const existing = await ctx.runQuery(api.aiSettings.getSettings);

    if (existing) {
      await ctx.runMutation(internal.aiSettings.updateSettings, {
        id: existing._id,
        relevanceKey: encryptedKey,
        updatedAt: now,
      });
    } else {
      await ctx.runMutation(internal.aiSettings.createSettings, {
        userId,
        activeProvider: "openai",
        relevanceKey: encryptedKey,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

/**
 * Get decrypted Relevance AI API key for the current user.
 */
export const getDecryptedRelevanceKey = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const fullSettings = await ctx.runQuery(internal.aiSettings.getSettingsWithKeys);
    if (!fullSettings?.relevanceKey) throw new Error("No Relevance AI key configured");

    return decrypt(fullSettings.relevanceKey);
  },
});

/**
 * List all agents from the user's Relevance AI account.
 * Returns read-only metadata (name, description, id, etc.)
 */
export const listRelevanceAgents = action({
  args: {},
  handler: async (ctx): Promise<any[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const fullSettings = await ctx.runQuery(internal.aiSettings.getSettingsWithKeys);
    if (!fullSettings?.relevanceKey) {
      return []; // No key configured — return empty
    }

    const apiKey = decrypt(fullSettings.relevanceKey);

    // Parse the key — Relevance AI key format: "region:project_id:api_key"
    const parts = apiKey.split(":");
    if (parts.length < 3) throw new Error("Invalid Relevance AI key format (expected region:project_id:api_key)");

    const [region, projectId] = parts;
    const authToken = parts.slice(2).join(":"); // Handle colons in the key portion

    const response = await fetch(`https://api-${region}.stack.tryrelevance.com/latest/agents/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${projectId}:${authToken}`,
      },
      body: JSON.stringify({ filters: [], page_size: 100 }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Relevance AI agents list failed: ${err}`);
    }

    const data = await response.json();
    return (data.results || []).map((agent: any) => ({
      id: agent.agent_id,
      name: agent.name || "Unnamed Agent",
      description: agent.metadata?.description || agent.description || "",
      icon: (agent.emoji || agent.metadata?.emoji || agent.icon || agent.metadata?.icon || "").length <= 4
        ? (agent.emoji || agent.metadata?.emoji || agent.icon || agent.metadata?.icon || "🤖")
        : "🤖",
      avatarUrl: agent.avatar_url || agent.metadata?.avatar_url || agent.profile_picture || agent.metadata?.profile_picture || agent.avatar || agent.metadata?.avatar || agent.icon_url || agent.metadata?.icon_url || (
        (agent.icon || agent.metadata?.icon || "").length > 4 ? (agent.icon || agent.metadata?.icon) : undefined
      ),
      _raw: agent,
    }));
  },
});

/**
 * List all tools from the user's Relevance AI account.
 * Returns read-only metadata.
 */
export const listRelevanceTools = action({
  args: {},
  handler: async (ctx): Promise<any[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const fullSettings = await ctx.runQuery(internal.aiSettings.getSettingsWithKeys);
    if (!fullSettings?.relevanceKey) {
      return []; // No key configured — return empty
    }

    const apiKey = decrypt(fullSettings.relevanceKey);
    const parts = apiKey.split(":");
    if (parts.length < 3) throw new Error("Invalid Relevance AI key format");

    const [region, projectId] = parts;
    const authToken = parts.slice(2).join(":");
    const baseUrl = `https://api-${region}.stack.tryrelevance.com/latest`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `${projectId}:${authToken}`,
    };

    // Log debug info to help diagnose 404s
    const toolsUrl = `${baseUrl}/tools/list`;
    console.log(`[listRelevanceTools] Trying: ${toolsUrl} | Auth: ${projectId}:***`);

    // Relevance AI tools endpoint: GET /tools/list
    const response = await fetch(toolsUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[listRelevanceTools] ${response.status} at ${toolsUrl}:`, body.slice(0, 200));
      return [];
    }

    const data = await response.json();
    return (data.results || []).map((tool: any) => ({
      id: tool.studio_id || tool.id,
      name: tool.title || tool.name || "Unnamed Tool",
      description: tool.description || "",
      icon: tool.emoji || "🔧",
      _raw: tool, // For debugging
    }));
  },
});


/**
 * Trigger a Relevance AI agent with a message.
 */
export const triggerRelevanceAgent = action({
  args: {
    agentId: v.string(),
    message: v.string(),
    taskId: v.optional(v.string()),
  },
  handler: async (ctx, { agentId, message, taskId }): Promise<any> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const fullSettings = await ctx.runQuery(internal.aiSettings.getSettingsWithKeys);
    if (!fullSettings?.relevanceKey) {
      throw new Error("Relevance AI key not configured");
    }

    const apiKey = decrypt(fullSettings.relevanceKey);
    const parts = apiKey.split(":");
    if (parts.length < 3) throw new Error("Invalid Relevance AI key format");

    const [region, projectId] = parts;
    const authToken = parts.slice(2).join(":");

    const triggerUrl = `https://api-${region}.stack.tryrelevance.com/latest/agents/trigger`;
    const triggerBody: any = {
      agent_id: agentId,
      message: {
        role: "user",
        content: message,
        attachments: [],
      },
    };

    if (taskId) {
      triggerBody.conversation_id = taskId;
    }

    console.log("[triggerRelevanceAgent] URL:", triggerUrl);
    console.log("[triggerRelevanceAgent] body:", JSON.stringify(triggerBody));

    const response = await fetch(triggerUrl, {
      method: "POST",
      headers: {
        Authorization: `${projectId}:${authToken}`,
      },
      body: JSON.stringify(triggerBody),
    });

    const responseText = await response.text();
    console.log("[triggerRelevanceAgent] status:", response.status);
    console.log("[triggerRelevanceAgent] response:", responseText.substring(0, 500));

    if (!response.ok) {
      throw new Error(`Relevance AI trigger failed (${response.status}): ${responseText}`);
    }

    const data = JSON.parse(responseText);
    console.log("[triggerRelevanceAgent] conversation_id:", data.conversation_id, "| state:", data.state);

    return {
      taskId: data.conversation_id,
      status: data.state
    };
  },
});

/**
 * Poll for a Relevance AI agent task completion and get the final result.
 */
export const pollRelevanceAgentResult = action({
  args: {
    agentId: v.string(),
    taskId: v.string(),
  },
  handler: async (ctx, { agentId, taskId }): Promise<{
    status: string;
    output?: string;
    steps?: Array<{
      id: string;
      state: string;
      title: string;
      description: string;
    }>;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const fullSettings = await ctx.runQuery(internal.aiSettings.getSettingsWithKeys);
    if (!fullSettings?.relevanceKey) {
      throw new Error("Relevance AI key not configured");
    }

    const apiKey = decrypt(fullSettings.relevanceKey);
    const [region, projectId, ...tokenParts] = apiKey.split(":");
    const authToken = tokenParts.join(":");
    const baseUrl = `https://api-${region}.stack.tryrelevance.com/latest`;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `${projectId}:${authToken}`,
    };

    // 1. Get Task Metadata to check status
    const metaRes = await fetch(`${baseUrl}/agents/${agentId}/tasks/${taskId}/metadata`, { headers });
    if (!metaRes.ok) return { status: "error", output: "Failed to fetch task metadata" };

    const metaData = await metaRes.json();
    const state = metaData.metadata?.conversation?.state;

    // States that mean the agent has finished generating its current response
    const finishedStates = ["completed", "idle", "pending-approval", "escalated"];
    const errorStates = ["errored-pending-approval", "unrecoverable", "timed-out"];

    let status = "running";
    if (finishedStates.includes(state)) {
      status = "completed";
    } else if (errorStates.includes(state)) {
      status = "error";
    }

    // Fetch Messages to get the agent's progress
    const viewRes = await fetch(`${baseUrl}/agents/${agentId}/tasks/${taskId}/view`, {
      method: "POST",
      headers,
      body: JSON.stringify({ page_size: 50 })
    });

    if (!viewRes.ok) {
      if (status !== "completed") return { status }; // Ignore fetch errors while still running
      return { status: "completed", output: "Task completed but failed to fetch messages" };
    }

    const viewData = await viewRes.json();
    const results = viewData.results || [];

    // Extract tool-run steps for intermediate progress tracking
    const steps = results
      .filter((m: any) => m.content?.type === "tool-run")
      .map((m: any) => ({
        id: m.item_id || m.insert_date_,
        state: m.content.tool_run_state, // e.g. "running", "finished", "error"
        title: m.content.tool_config?.title || "Agent Step",
        description: m.content.tool_config?.description || "",
      }))
      .reverse(); // Reverse so they are in chronological order

    // Find the final answer message if it exists
    const agentMsg = results.find((m: any) => m.content?.type === "agent-message");

    if (status !== "completed") {
      return {
        status,
        steps
      };
    }

    return {
      status: "completed",
      output: agentMsg?.content?.text || "No message returned from agent.",
      steps
    };
  },
});


