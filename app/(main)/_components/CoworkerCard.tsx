"use client";

import Image from "next/image";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface CoworkerCardProps {
    id: string;
    name: string;
    description: string;
    creator: string;
    icon?: React.ReactNode;
    creatorImage?: string;
    color?: string;
}

export function CoworkerCard({
    id,
    name,
    description,
    creator,
    icon,
    creatorImage,
    color = "bg-orange-100",
}: CoworkerCardProps) {
    const router = useRouter();
    const handleClick = () => {
        router.push(`/coworkers/${id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group relative flex cursor-pointer flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
        >
            <div>
                <div className="flex items-start justify-between">
                    <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-full overflow-hidden bg-white border shadow-sm", color)}>
                        {icon || (
                            <div className="relative h-8 w-8">
                                <Image
                                    src="/agent-logo.png"
                                    alt="Agent Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>
                <h3 className="mb-2 font-semibold leading-none tracking-tight">{name}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                    {description}
                </p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t">
                <Avatar className="h-5 w-5">
                    <AvatarImage src={creatorImage} />
                    <AvatarFallback className="text-[10px]">
                        <User className="h-3 w-3" />
                    </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{creator}</span>
            </div>
        </div>
    );
}
