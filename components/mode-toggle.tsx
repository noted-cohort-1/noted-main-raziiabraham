"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trackThemeChanged } from "@/lib/analytics";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const onThemeSelect = (theme: "light" | "dark" | "system") => {
    setTheme(theme);
    trackThemeChanged({ theme });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onThemeSelect("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onThemeSelect("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onThemeSelect("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
