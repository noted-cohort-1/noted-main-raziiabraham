import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  GitPullRequest,
  GraduationCap,
  MessageSquareText,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Footer } from "../_components/footer";
import {
  HiringVibePmsPageVisitTracker,
  TrackedHiringAnchor,
  TrackedHiringLink,
} from "../_components/landing-analytics";
import { Logo } from "../_components/logo";

const BrandName = () => (
  <Logo className="inline align-baseline text-[1em] leading-none text-current" />
);

export const metadata: Metadata = {
  title: "Noted's Vibe PM course simulates your first 30 days",
  description:
    "A 4-week live Vibe PM course framed like your first 30 days on probation at Noted: inherited context, product judgment, bring-your-own tools, and shipped PM proof.",
};

const outcomes = [
  "A working command of Noted's product, customers, roadmap, and team rituals",
  "A PM toolkit you authored from skills, commands, subagents, and MCP recipes",
  "A first-30-days memo with citations, personas, JTBD, synthesis, and a reviewed PRD",
  "A concrete plan for what you would ship next, with review notes and execution tradeoffs",
];

const surfaces = [
  {
    title: "The actual product",
    description: (
      <>
        Work inside <BrandName />
        {"'s"} live product context: an AI-native workspace with real product
        tradeoffs.
      </>
    ),
    icon: Briefcase,
  },
  {
    title: "The actual inbox",
    description:
      "Start with messy inherited context: tickets, customer calls, analytics, Slack threads, product decisions, and Sarah's hand-off doc.",
    icon: MessageSquareText,
  },
  {
    title: "The actual operating rhythm",
    description:
      "Use the same PRD, design-system, PR review, merge, analytics, and ship-log habits that keep product and engineering aligned.",
    icon: Network,
  },
];

const weeks = [
  {
    week: "Week 1",
    title: "Week 1: Inherit the seat and read the room",
    detail:
      "Read Sarah's hand-off, get your Week 1 materials in place, and read the room across backlog, customer signal, and product context.",
  },
  {
    week: "Week 2",
    title: "Week 2: Build your operating system",
    detail:
      "Author the skills, commands, subagents, and MCP recipes you will use to direct product work without outsourcing judgment.",
  },
  {
    week: "Week 3",
    title: "Week 3: Run discovery at scale",
    detail:
      "Gather signal across customer calls, analytics, competitors, and product history, then turn it into a sharper priority memo.",
  },
  {
    week: "Week 4",
    title: "Week 4: Synthesize, spec, and dispatch the agent",
    detail:
      "Synthesize the signal, write the PRD, dispatch the agent on bounded work, and defend what should ship next.",
  },
];

const proofPoints = [
  {
    label: "4 weeks",
    detail: "Live core framed like the first 30 days of PM probation.",
  },
  {
    label: "10 seats",
    detail:
      "Pilot cohort capped tightly so review and discussion stay hands-on.",
  },
  {
    label: "7 hrs/week",
    detail: "A realistic weekly load across live session, async work, and PRs.",
  },
  {
    label: "Any AI IDE",
    detail:
      "Codex, Cursor, or Claude Code all work. The track is about judgment and workflow design, not tool loyalty.",
  },
];

const artifacts = [
  {
    id: "portfolio",
    title: (
      <>
        Your <BrandName /> PM portfolio
      </>
    ),
    description:
      "A concrete trail of decisions, specs, prototypes, reviews, and shipped work.",
    icon: GitPullRequest,
  },
  {
    id: "toolkit",
    title: "Your agentic PM toolkit",
    description:
      "A reusable operating layer made from commands, skills, subagents, MCP recipes, and review workflows.",
    icon: Bot,
  },
  {
    id: "discovery",
    title: "Your discovery evidence",
    description:
      "Problem maps, interview synthesis, competitor pulse, JTBD, and a reviewed PRD.",
    icon: Radar,
  },
  {
    id: "story",
    title: "Your hiring story",
    description:
      "A concrete arc from inherited ambiguity to customer evidence, spec, PR review, and a credible first-30-days plan.",
    icon: GraduationCap,
  },
];

const teamMembers = [
  {
    name: "Razii",
    role: "Founder, CEO, Head of Product Engineering",
    image: "/team/raz.webp",
    description:
      "Reads everything, replies fast in Slack, and gives you decision authority instead of asking you to wait for founder taste.",
  },
  {
    name: "Sarah",
    role: "Outgoing PM",
    image: "/team/sarah.webp",
    description:
      "Held the seat for 14 months and leaves the unofficial tour: product history, roadmap politics, and the traps she would avoid next time.",
  },
  {
    name: "Priya",
    role: "Customer Success",
    image: "/team/priya.webp",
    description:
      "Reads every support ticket, knows users by name, and is the highest-signal source Sarah warns you not to underuse.",
  },
  {
    name: "Diego",
    role: "Engineering Lead",
    image: "/team/diego.webp",
    description:
      "Owns the Convex backend, AI integrations, and deploy pipeline. Direct questions beat surprises with him.",
  },
  {
    name: "Maya",
    role: "Designer",
    image: "/team/maya.webp",
    description:
      "Owns DESIGN.md and treats the design-system contract as a real operating artifact, not decoration.",
  },
  {
    name: "Sam",
    role: "Backend Engineer",
    image: "/team/sam.webp",
    description:
      "Quieter than Diego and often right when he flags scaling or data-model issues others missed.",
  },
];

const faqs = [
  {
    question: "Do I need to know how to code?",
    answer:
      "No coding background is required, but you should be willing to use a terminal, read diffs, and learn enough technical context to direct agents responsibly.",
  },
  {
    question: "Is this tied to one AI tool?",
    answer:
      "No. Codex, Cursor, or Claude Code all work. The role is about directing agents across workflows and team contexts, not standardizing everyone onto one stack.",
  },
  {
    question: "Is this real hiring?",
    answer:
      "No. Despite the hiring-style framing, this is a cohort-based course, not a real hiring process, job opening, or promise of employment. The outcome is portfolio-grade PM proof and a sharper agentic product workflow.",
  },
  {
    question: "What makes this different from other courses?",
    answer:
      "Most courses stay at frameworks, prompts, or case studies. This one drops you into a live-feeling PM seat with inherited context, messy signal, real tradeoffs, and a workflow you have to direct end to end.",
  },
];

export default function HiringVibePMsPage() {
  return (
    <div className="flex min-h-full flex-col bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white">
      <HiringVibePmsPageVisitTracker />
      <div className="flex-1">
        <section className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 md:pb-24 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                <BrandName /> careers · Founding Vibe PM track
              </div>

              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-5xl lg:text-7xl">
                Simulate your first 30 days as a Vibe PM at <BrandName />.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300 sm:text-xl">
                This 4-week live course drops you into <BrandName />
                {"'s"} PM seat. You inherit backlog, customer evidence,
                analytics, and one probation-style question from the founder:
                what should we ship next?
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 rounded-lg bg-blue-600 px-8 text-base font-medium text-white hover:bg-blue-700"
                  asChild
                >
                  <TrackedHiringAnchor
                    href="https://www.linkedin.com/in/raziiabraham/"
                    target="_blank"
                    rel="noreferrer"
                    ctaLabel="Apply for the 4-week Vibe PM course"
                    destinationPath="https://www.linkedin.com/in/raziiabraham/"
                  >
                    Apply for the 4-week course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </TrackedHiringAnchor>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-lg px-8 text-base"
                  asChild
                >
                  <TrackedHiringLink
                    href="#first-30-days"
                    ctaLabel="See the first 30 days"
                    destinationPath="#first-30-days"
                  >
                    See the first 30 days
                  </TrackedHiringLink>
                </Button>
              </div>

              <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
                Pilot cohort timing is being finalized. Seats are capped at 10
                people, with prep notes sent before Week 1.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-950">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4 dark:border-neutral-800">
                  <div>
                    <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Course role-play
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Vibe Product Manager
                    </h2>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "12 inherited product tickets across planned, blocked, and shipped work",
                    "5 interview transcripts and 5 customer-success calls to mine",
                    "A PM toolkit with skills, commands, MCP recipes, and subagents to extend",
                    "A draft execution plan with planted review issues to catch before you recommend a ship call",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    By the end, you do not just say you can handle the seat.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    You have a reviewed PRD, an agent toolkit, and a defensible
                    first-30-days recommendation grounded in fuzzy evidence and
                    product judgment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200 bg-neutral-50 py-12 dark:border-neutral-800 dark:bg-neutral-900/40">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {proofPoints.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <p className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                The thesis
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                The next great PMs direct agents without outsourcing judgment.
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                Agentic tools collapse cycle time on discovery, specs,
                prototypes, reviews, and launch work. The gap is no longer who
                can prompt a chatbot. It is who can compose skills, commands,
                subagents, MCP connectors, and PR review habits into reliable
                workflows the team can trust.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {surfaces.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950"
                  >
                    <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          id="first-30-days"
          className="border-y border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  Your first 30 days
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  What PM probation should feel like.
                </h2>
                <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                  Each week mirrors a real first-month signal. You inherit
                  context, make judgment calls, build your operating layer, and
                  leave with a plan you could credibly defend to a founder.
                </p>
              </div>

              <div className="space-y-4">
                {weeks.map((item) => (
                  <div
                    key={item.week}
                    className="grid gap-3 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950 sm:grid-cols-[8rem_1fr]"
                  >
                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {item.week}
                    </p>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                Your team
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Work with the simulated <BrandName /> team.
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
                The course gives you a live-feeling operating room: founder
                pressure, PM handoff, customer success signal, engineering risk,
                design critique, and infrastructure constraints.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <div className="aspect-square bg-neutral-100 dark:bg-neutral-900">
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.role}`}
                      width={1024}
                      height={1024}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                          {member.role}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                      {member.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  What you leave with
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Proof of judgment, not interview theater.
                </h2>
                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {artifacts.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border border-neutral-200 p-5 dark:border-neutral-800"
                      >
                        <Icon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                        <h3 className="mt-4 font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="text-xl font-semibold">The outcome stack</h3>
                <div className="mt-6 space-y-4">
                  {outcomes.map((item) => (
                    <div key={item} className="flex gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                  <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    The 4-week core stands on its own. Strong students can stay
                    for an optional 2-week capstone sprint to turn the plan
                    into portfolio-grade shipped work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200 bg-neutral-950 py-20 text-white dark:border-neutral-800 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
                Built for working PMs
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                You bring product judgment. The track gives it a sharper
                operating system.
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-300">
                The bar is comfort with ambiguity, not comfort with code. You
                will learn enough technical literacy to make better calls, write
                tighter specs, run agent workflows, review PRs, and know when to
                stop and bring engineering in.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Working PMs at any seniority",
                "Founders doing their own product work",
                "Operators moving into product roles",
                "Design, research, or CS leads who own discovery",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/5 p-5"
                >
                  <p className="font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Practical details
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {faqs.map((item) => (
                <div
                  key={item.question}
                  className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800"
                >
                  <h3 className="font-semibold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200 bg-neutral-50 py-20 dark:border-neutral-800 dark:bg-neutral-900/40 sm:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Apply to the 4-week Vibe PM course.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Applications are planned through Razii&apos;s LinkedIn. Send your
              current role, why this operating model matters to you, and what
              do you expect to get out of this course.
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                className="h-12 rounded-lg bg-blue-600 px-8 text-base font-medium text-white hover:bg-blue-700"
                asChild
              >
                <TrackedHiringAnchor
                  href="https://www.linkedin.com/in/raziiabraham/"
                  target="_blank"
                  rel="noreferrer"
                  ctaLabel="Apply via LinkedIn DM"
                  destinationPath="https://www.linkedin.com/in/raziiabraham/"
                >
                  Apply via LinkedIn DM
                  <ArrowRight className="ml-2 h-4 w-4" />
                </TrackedHiringAnchor>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
