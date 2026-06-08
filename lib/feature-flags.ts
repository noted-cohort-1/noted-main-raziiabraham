import {
  Experiment,
  type ExperimentUser,
  type RemoteEvaluationClient,
} from "@amplitude/experiment-node-server";

export { FEATURE_FLAGS } from "./feature-flag-keys";

const DEFAULT_EXPERIMENT_USER: ExperimentUser = {
  user_id: process.env.AMPLITUDE_EXPERIMENT_USER_ID ?? "noted-server",
  device_id: process.env.AMPLITUDE_EXPERIMENT_DEVICE_ID ?? "noted-server",
  user_properties: {
    app: "noted",
    surface: "server",
  },
};

let amplitudeExperimentClient: RemoteEvaluationClient | null = null;

function booleanVariant(value: string | undefined): boolean | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (["1", "true", "yes", "on", "enabled"].includes(normalized)) return true;
  if (["0", "false", "no", "off", "disabled"].includes(normalized)) {
    return false;
  }
  return null;
}

function getAmplitudeExperimentClient(): RemoteEvaluationClient | null {
  const deploymentKey =
    process.env.AMPLITUDE_EXPERIMENT_SERVER_DEPLOYMENT_KEY ??
    process.env.AMPLITUDE_EXPERIMENT_DEPLOYMENT_KEY;

  if (!deploymentKey) return null;

  amplitudeExperimentClient ??= Experiment.initializeRemote(deploymentKey);
  return amplitudeExperimentClient;
}

export async function getBooleanFeatureFlag(
  flagKey: string,
  defaultValue: boolean,
  user: ExperimentUser = DEFAULT_EXPERIMENT_USER,
): Promise<boolean> {
  const client = getAmplitudeExperimentClient();
  if (!client) return defaultValue;

  try {
    const variants = await client.fetchV2(user);
    return booleanVariant(variants[flagKey]?.value) ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function hiringVibePmsPageDefault(): boolean {
  return false;
}
