"use client";

import { CoworkerCard } from "../../_components/CoworkerCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function CoworkersPage() {
    return (
        <div className="flex flex-col h-full p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">Coworkers</h1>

                {/* Filters */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
                        <button className="px-3 py-1.5 text-sm font-medium bg-background shadow-sm rounded-md transition-all">
                            All
                        </button>
                        <button className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-background/50 rounded-md transition-all">
                            Created by me
                        </button>
                    </div>

                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search coworkers..."
                            className="pl-9 h-9 bg-muted/30 border-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Placeholder for future agents */}
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground hover:bg-muted/20 transition-colors cursor-pointer min-h-[280px]">
                        <span className="text-sm font-medium">Create custom coworker</span>
                        <span className="text-xs text-muted-foreground mt-1 text-center">Coming soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
