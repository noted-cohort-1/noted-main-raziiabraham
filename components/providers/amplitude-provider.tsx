"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import {
  identifyAmplitudeUser,
  initAmplitude,
  trackUserLoggedIn,
  trackUserLoggedOut,
} from "@/lib/analytics";
import { fetchAmplitudeExperimentVariants } from "@/lib/client-feature-flags";

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
 * - When `NEXT_PUBLIC_AMPLITUDE_EXPERIMENT_CLIENT_DEPLOYMENT_KEY` is
 *   set, client-side flags/experiments are fetched after Clerk identity
 *   is known.
 */
export const AmplitudeProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const previousSignedInRef = useRef<boolean | null>(null);

  useEffect(() => {
    initAmplitude();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const isCurrentlySignedIn = Boolean(isSignedIn && user);
    const wasSignedIn = previousSignedInRef.current;

    if (isCurrentlySignedIn && user) {
      const emailDomain =
        user.primaryEmailAddress?.emailAddress.split("@")[1] ?? undefined;

      identifyAmplitudeUser(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName ?? undefined,
      });
      void fetchAmplitudeExperimentVariants({
        user_id: user.id,
        user_properties: {
          signed_in: true,
          ...(emailDomain ? { email_domain: emailDomain } : {}),
        },
      });

      if (wasSignedIn === false) {
        trackUserLoggedIn();
      }
    } else {
      if (wasSignedIn === true) {
        trackUserLoggedOut();
      }

      identifyAmplitudeUser(null);
      void fetchAmplitudeExperimentVariants({
        user_properties: {
          signed_in: false,
        },
      });
    }

    previousSignedInRef.current = isCurrentlySignedIn;
  }, [isLoaded, isSignedIn, user]);

  return <>{children}</>;
};
