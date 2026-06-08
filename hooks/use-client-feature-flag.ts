"use client";

import { useEffect, useState } from "react";

import { getClientBooleanFeatureFlag } from "@/lib/client-feature-flags";

export function useClientFeatureFlag(
  flagKey: string,
  defaultValue: boolean,
): boolean {
  const [enabled, setEnabled] = useState(defaultValue);

  useEffect(() => {
    let mounted = true;

    void getClientBooleanFeatureFlag(flagKey, defaultValue).then((value) => {
      if (mounted) setEnabled(value);
    });

    return () => {
      mounted = false;
    };
  }, [flagKey, defaultValue]);

  return enabled;
}
