"use client";

import {
  Experiment,
  LogLevel,
  type ExperimentClient,
  type ExperimentUser,
} from "@amplitude/experiment-js-client";

let amplitudeExperimentClient: ExperimentClient | null = null;

function booleanVariant(value: string | undefined): boolean | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) {
    return false;
  }
  return null;
}

function getClientDeploymentKey(): string | undefined {
  return process.env.NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_CLIENT_DEPLOYMENT_KEY;
}

export function getAmplitudeExperimentClient(): ExperimentClient | null {
  if (typeof window === "undefined") return null;

  const deploymentKey = getClientDeploymentKey();
  if (!deploymentKey) return null;

  amplitudeExperimentClient ??= Experiment.initializeWithAmplitudeAnalytics(
    deploymentKey,
    {
      automaticFetchOnAmplitudeIdentityChange: true,
      fetchOnStart: false,
      logLevel: LogLevel.Error,
    },
  );

  return amplitudeExperimentClient;
}

export function isAmplitudeExperimentDisabled(): boolean {
  return getAmplitudeExperimentClient() === null;
}

export async function fetchAmplitudeExperimentVariants(
  user?: ExperimentUser,
): Promise<void> {
  const client = getAmplitudeExperimentClient();
  if (!client) return;

  try {
    await client.fetch(user);
  } catch {
    // Experiment should never break the product experience.
  }
}

export function getClientFeatureFlagVariant(
  flagKey: string,
  fallbackVariant = "off",
): string {
  const client = getAmplitudeExperimentClient();
  if (!client) return fallbackVariant;

  return client.variant(flagKey, fallbackVariant).value ?? fallbackVariant;
}

export async function getClientBooleanFeatureFlag(
  flagKey: string,
  defaultValue: boolean,
  user?: ExperimentUser,
): Promise<boolean> {
  await fetchAmplitudeExperimentVariants(user);
  return (
    booleanVariant(
      getClientFeatureFlagVariant(flagKey, defaultValue ? "on" : "off"),
    ) ?? defaultValue
  );
}
