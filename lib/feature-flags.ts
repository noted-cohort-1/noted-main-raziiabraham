import { init, type LDClient, type LDContext } from "@launchdarkly/node-server-sdk";

export const FEATURE_FLAGS = {
  hiringVibePmsPage: "hiring-vibe-pms-page",
} as const;

const DEFAULT_CONTEXT: LDContext = {
  kind: "user",
  key: process.env.LAUNCHDARKLY_CONTEXT_KEY ?? "noted-server",
  name: process.env.LAUNCHDARKLY_CONTEXT_NAME ?? "Noted Server",
};

let launchDarklyClient: LDClient | null = null;
let launchDarklyInitPromise: Promise<LDClient | null> | null = null;

function booleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

async function getLaunchDarklyClient(): Promise<LDClient | null> {
  const sdkKey = process.env.LAUNCHDARKLY_SDK_KEY;
  if (!sdkKey) return null;
  if (launchDarklyClient) return launchDarklyClient;

  launchDarklyInitPromise ??= (async () => {
    const client = init(sdkKey);
    try {
      await client.waitForInitialization({ timeout: 5 });
      launchDarklyClient = client;
      return client;
    } catch {
      return null;
    }
  })();

  return launchDarklyInitPromise;
}

export async function getBooleanFeatureFlag(
  flagKey: string,
  defaultValue: boolean,
  context: LDContext = DEFAULT_CONTEXT,
): Promise<boolean> {
  const client = await getLaunchDarklyClient();
  if (!client) return defaultValue;
  return await client.variation(flagKey, context, defaultValue);
}

export function hiringVibePmsPageDefault(): boolean {
  return booleanEnv(process.env.HIRING_VIBE_PMS_PAGE_DEFAULT, true);
}
