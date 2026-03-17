"use client";

import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureCTAProps {
    headline: string;
    subheadline: string;
}

export const FeatureCTA = ({ headline, subheadline }: FeatureCTAProps) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <div className="mt-20 flex flex-col items-center border-t border-neutral-100 pt-16 w-full max-w-2xl px-4 text-center dark:border-neutral-800">
            <h2 className="mb-4 text-3xl font-bold">{headline}</h2>
            <p className="mb-8 text-lg text-muted-foreground">{subheadline}</p>

            <div className="flex flex-col items-center gap-4 sm:flex-row">
                {isLoading && (
                    <div className="flex w-full items-center justify-center">
                        <Spinner size="md" />
                    </div>
                )}
                {isAuthenticated && !isLoading && (
                    <Button
                        size="lg"
                        className="h-12 rounded-lg bg-blue-600 px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                        asChild
                    >
                        <Link href="/documents">
                            Enter Noted
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                )}
                {!isAuthenticated && !isLoading && (
                    <>
                        <SignInButton mode="modal">
                            <Button
                                size="lg"
                                className="h-12 rounded-lg bg-blue-600 px-8 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                            >
                                Get Noted free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </SignInButton>
                    </>
                )}
            </div>
        </div>
    );
};
