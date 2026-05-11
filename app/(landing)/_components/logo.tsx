import { cn } from "@/lib/utils";
import { DM_Serif_Display } from "next/font/google";

const font = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

type LogoProps = {
  className?: string;
};

export const Logo = ({ className }: LogoProps) => {
  return (
    <span
      className={cn(
        "text-2xl font-semibold tracking-tight text-foreground",
        font.className,
        className,
      )}
    >
      Noted
    </span>
  );
};
