"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { use, useMemo } from "react";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Bot, Info } from "lucide-react";

interface DocumentIdPageProps {
  params: Promise<{
    documentId: Id<"documents">;
  }>;
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const unwrappedParams = use(params);
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    [],
  );

  const document = useQuery(api.documents.getById, {
    documentId: unwrappedParams.documentId,
  });

  const config = useQuery(api.coworkerConfig.getConfig);
  const isAgentInstructions = config?.instructionsDocId === unwrappedParams.documentId;

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({
      id: unwrappedParams.documentId,
      content,
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="mx-auto mt-10 md:max-w-3xl lg:max-w-4xl">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-1/2" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl px-4 md:pl-[54px] md:pr-10">
        <Toolbar initialData={document} />
        {isAgentInstructions && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg my-4 flex gap-3 text-sm text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-900/50">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div>
              <p className="font-medium mb-1">Agent Context</p>
              <p className="opacity-90">
                This document defines the personality and behavior of your Marketing Intelligence Specialist agent.
                Any text you write here will be used as the System Prompt.
              </p>
            </div>
          </div>
        )}
        <Editor
          onChange={onChange}
          initialContent={document.content}
          documentId={unwrappedParams.documentId}
        />
      </div>
    </div>
  );
};
export default DocumentIdPage;
