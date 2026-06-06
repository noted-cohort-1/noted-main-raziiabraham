"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import Navigation from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";
import { CoworkerFloatingChat } from "@/components/coworker/coworker-floating-chat";
import { useCoworkerConfig } from "@/hooks/use-coworker-config";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { isExpanded } = useCoworkerConfig();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="flex h-full dark:bg-background">
      <Navigation />
      <main className="h-full flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full" type="auto">
          <div className="flex flex-col items-center w-full h-full min-h-full transition-all duration-300 ease-in-out">
            <div className={cn(
              "w-full h-full",
              isExpanded && "max-w-5xl" // Constrain width when sidebar is open
            )}>
              <SearchCommand />
              {children}
            </div>
          </div>
        </ScrollArea>
      </main>
      <CoworkerFloatingChat />
    </div >
  );
};
export default MainLayout;

