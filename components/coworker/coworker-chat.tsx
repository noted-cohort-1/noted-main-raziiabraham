"use client";

import { useRef, useEffect } from "react";
import type { UIMessage } from "ai";
import { CoworkerMessage } from "./coworker-message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";
import type { CoworkerMessagePart } from "@/lib/coworker-message-ui";

interface CoworkerChatProps {
  messages: UIMessage[];
  isStreaming?: boolean;
}

function getMessageParts(message: UIMessage): CoworkerMessagePart[] {
  return (message.parts ?? []) as CoworkerMessagePart[];
}

export function CoworkerChat({ messages, isStreaming }: CoworkerChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const coworkerName = "AI Squad";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border bg-primary/10 shadow-sm">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mb-1 font-medium">{coworkerName}</h3>
        <p className="text-sm text-muted-foreground">
          I&apos;m here to help you work with your documents. Ask me to research
          information, summarize your workspace, or create new content for you.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4">
      <div className="flex flex-col gap-3 pb-2">
        {messages.map((message) => {
          if (message.role === "user") {
            const parts = getMessageParts(message);
            const textPart = parts.find((part) => part.type === "text");
            const userContent = textPart?.text ?? "";

            return (
              <CoworkerMessage
                key={message.id}
                role="user"
                content={userContent}
                parts={[]}
                isStreaming={false}
              />
            );
          }

          const parts = getMessageParts(message);
          const toolInvocations =
            (message as UIMessage & { toolInvocations?: CoworkerMessagePart[] })
              .toolInvocations ?? [];
          const enrichedParts = [...parts];

          if (toolInvocations.length > 0) {
            const hasToolParts = parts.some(
              (part) =>
                part.type === "tool-call" || part.type?.startsWith("tool-"),
            );

            if (!hasToolParts) {
              toolInvocations.forEach((invocation) => {
                enrichedParts.push({
                  ...invocation,
                  type: invocation.type ?? "tool-invocation",
                });
              });
            }
          }

          const textContent = parts
            .filter((part) => part.type === "text")
            .map((part) => part.text ?? "")
            .join("");

          return (
            <CoworkerMessage
              key={message.id}
              role="assistant"
              content={textContent}
              parts={enrichedParts}
              isStreaming={
                isStreaming && message === messages[messages.length - 1]
              }
            />
          );
        })}

        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <CoworkerMessage
            key="thinking-placeholder"
            role="assistant"
            content=""
            parts={[]}
            isStreaming={true}
          />
        )}

        <div ref={bottomRef} className="h-px w-full" />
      </div>
    </ScrollArea>
  );
}
