"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useEffect,
} from "react";
import {
  trackHiringVibePmsCtaClicked,
  trackHiringVibePmsPageVisited,
  trackLandingFeatureClicked,
  trackLandingFeaturePageVisited,
} from "@/lib/analytics";

const FEATURE_NAMES: Record<string, string> = {
  "ai-writing": "AI Writing",
  editor: "Editor",
  files: "Files",
  publish: "Publish",
  search: "Search",
  squad: "Squad",
};

export const LandingFeaturePageVisitTracker = () => {
  const pathname = usePathname();
  const featureSlug = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const featureName = FEATURE_NAMES[featureSlug] ?? featureSlug;

  useEffect(() => {
    if (!featureName) return;

    trackLandingFeaturePageVisited({
      feature_name: featureName,
      page_path: pathname,
    });
  }, [featureName, pathname]);

  return null;
};

type HiringVibePmsPageVisitTrackerProps = {
  featureFlagKey?: string;
  featureFlagVariant?: string;
};

export const HiringVibePmsPageVisitTracker = ({
  featureFlagKey,
  featureFlagVariant,
}: HiringVibePmsPageVisitTrackerProps) => {
  useEffect(() => {
    trackHiringVibePmsPageVisited({
      page_path: "/hiring-vibe-pms",
      feature_flag_key: featureFlagKey,
      feature_flag_variant: featureFlagVariant,
    });
  }, [featureFlagKey, featureFlagVariant]);

  return null;
};

type TrackedFeatureLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  featureName: string;
  destinationPath: string;
};

export const TrackedFeatureLink = forwardRef<
  HTMLAnchorElement,
  TrackedFeatureLinkProps
>(({ featureName, destinationPath, onClick, ...props }, ref) => (
  <Link
    {...props}
    ref={ref}
    onClick={(event) => {
      trackLandingFeatureClicked({
        feature_name: featureName,
        destination_path: destinationPath,
      });
      onClick?.(event);
    }}
  />
));

TrackedFeatureLink.displayName = "TrackedFeatureLink";

type TrackedHiringAnchorProps = ComponentPropsWithoutRef<"a"> & {
  ctaLabel: string;
  destinationPath: string;
  children: ReactNode;
};

export const TrackedHiringAnchor = forwardRef<
  HTMLAnchorElement,
  TrackedHiringAnchorProps
>(({ ctaLabel, destinationPath, onClick, ...props }, ref) => (
  <a
    {...props}
    ref={ref}
    onClick={(event) => {
      trackHiringVibePmsCtaClicked({
        cta_label: ctaLabel,
        destination_path: destinationPath,
      });
      onClick?.(event);
    }}
  />
));

TrackedHiringAnchor.displayName = "TrackedHiringAnchor";

type TrackedHiringLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  ctaLabel: string;
  destinationPath: string;
};

export const TrackedHiringLink = forwardRef<
  HTMLAnchorElement,
  TrackedHiringLinkProps
>(({ ctaLabel, destinationPath, onClick, ...props }, ref) => (
  <Link
    {...props}
    ref={ref}
    onClick={(event) => {
      trackHiringVibePmsCtaClicked({
        cta_label: ctaLabel,
        destination_path: destinationPath,
      });
      onClick?.(event);
    }}
  />
));

TrackedHiringLink.displayName = "TrackedHiringLink";
