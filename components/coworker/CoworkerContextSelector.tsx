"use client";

import { useEffect, useState } from "react";
import { File } from "lucide-react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface CoworkerContextSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (id: Id<"documents">, title: string, icon?: string) => void;
}

export const CoworkerContextSelector = ({
    isOpen,
    onClose,
    onSelect,
}: CoworkerContextSelectorProps) => {
    const { user } = useUser();
    const documents = useQuery(api.documents.getSearch);
    const agents = useQuery((api as any).squadAgents.list);
    const [isMounted, setIsMounted] = useState(false);

    // Filter out documents that are used as agent instructions
    const filteredDocuments = documents?.filter(
        (doc) => !agents?.some((agent: any) => agent.instructionsDocId === doc._id)
    );

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder={`Search available pages...`} />
            <CommandList>
                <CommandEmpty>No pages found.</CommandEmpty>
                <CommandGroup heading="Select a page to add to context">
                    {filteredDocuments?.map((document) => (
                        <CommandItem
                            key={document._id}
                            value={`${document._id}-${document.title}`}
                            title={document.title}
                            onSelect={() => {
                                onSelect(document._id, document.title, document.icon);
                                onClose();
                            }}
                        >
                            {document.icon ? (
                                <p className="mr-2 text-[1.125rem]">{document.icon}</p>
                            ) : (
                                <File className="mr-2 h-4 w-4" />
                            )}
                            <span>{document.title}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};
