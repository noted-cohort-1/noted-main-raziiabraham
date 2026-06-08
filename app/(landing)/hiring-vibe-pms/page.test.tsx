import * as React from "react";
import { render, screen } from "@testing-library/react";

import HiringVibePMsPage from "@/app/(landing)/hiring-vibe-pms/page";

jest.mock("@/app/(landing)/_components/footer", () => ({
  Footer: () => <footer data-testid="mock-footer">Footer</footer>,
}));

jest.mock("@/app/(landing)/_components/logo", () => ({
  Logo: ({ className }: { className?: string }) => (
    <span className={className}>Noted</span>
  ),
}));

jest.mock("@/app/(landing)/_components/landing-analytics", () => ({
  HiringVibePmsPageVisitTracker: () => null,
  TrackedHiringAnchor: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
  TrackedHiringLink: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

describe("HiringVibePMsPage", () => {
  it("renders the 4-week first-30-days framing", async () => {
    render(await HiringVibePMsPage());

    expect(
      screen.getByRole("heading", {
        name: /simulate your first 30 days as a vibe pm at noted/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("4 weeks")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /see the first 30 days/i }),
    ).toHaveAttribute("href", "#first-30-days");
    expect(
      screen.getByRole("heading", {
        name: /what pm probation should feel like/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });
});
