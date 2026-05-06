"use client";

import { ReactNode, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { identifyAmplitudeUser, initAmplitude } from "@/lib/analytics";

/**
 * Boots the Amplitude SDK once at app load and keeps the Amplitude user
 * identity in sync with Clerk. Mount this once, near the top of the
 * client tree, inside the Clerk provider so `useUser()` is available.
 *
 * - When `NEXT_PUBLIC_AMPLITUDE_API_KEY` is unset, the SDK is never
 *   initialized and every event call is dropped silently. See
 *   `lib/analytics.ts` and the `event-tracking` skill.
 * - On sign-out, `identifyAmplitudeUser(null)` resets the device ID so
 *   the next session is a clean visitor.
 */
export const AmplitudeProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      identifyAmplitudeUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName ?? undefined,
      });
    } else {
      identifyAmplitudeUser(null);
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
};
