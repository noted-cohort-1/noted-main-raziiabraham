import Link from "next/link";
import { Logo } from "./logo";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-neutral-100 bg-white py-12 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Footer Content */}
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex justify-center md:flex-1 md:justify-start">
            <Logo />
          </div>

          {/* Attribution */}
          <div className="flex justify-center md:flex-1">
            <span className="text-center text-sm italic text-neutral-500">
              The human-in-the-loop @{" "}
              <a
                href="https://linkedin.com/in/raziiabraham"
                target="_blank"
                rel="noreferrer"
                className="font-medium transition-colors hover:text-neutral-900 hover:underline dark:hover:text-white"
              >
                raziiabraham
              </a>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 md:flex-1 md:justify-end">
            <Link
              href="/privacy"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-neutral-900 dark:hover:text-white"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
