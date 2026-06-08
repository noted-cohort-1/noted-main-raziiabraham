#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  intBetween,
  mulberry32,
  pick,
  readExpandedConvexFixture,
} from "./cohort-fixture.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, "fixtures/cohort-sample-data.json");
const planPath = path.resolve(__dirname, "fixtures/amplitude-plan.json");
const analyticsPath = path.resolve(__dirname, "../lib/analytics.ts");
const endpoint = process.env.AMPLITUDE_ENDPOINT ?? "https://api2.amplitude.com/2/httpapi";
const apiKey = process.env.AMPLITUDE_API_KEY;
const dayMs = 24 * 60 * 60 * 1000;

function parseArgs(argv) {
  const options = {
    apply: false,
    out: "",
    days: undefined,
    users: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--apply") {
      options.apply = true;
    } else if (arg === "--out") {
      options.out = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === "--days") {
      options.days = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (arg === "--users") {
      options.users = Number.parseInt(argv[index + 1], 10);
      index += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  npm run seed:amplitude:plan
  AMPLITUDE_API_KEY=... npm run seed:amplitude
  npm run seed:amplitude:plan -- --out /tmp/noted-amplitude-events.json

Default mode generates a dry-run event stream only.
Set AMPLITUDE_API_KEY and pass --apply to send events to your Amplitude project.
`);
}

async function readEventCatalog() {
  const raw = await readFile(analyticsPath, "utf8");
  const matches = [...raw.matchAll(/trackPageEvent\("([^"]+)"/g)];
  return new Set(matches.map((match) => match[1]));
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function indexByUser(rows) {
  const byUser = new Map();
  for (const row of rows) {
    const rowsForUser = byUser.get(row.userId) ?? [];
    rowsForUser.push(row);
    byUser.set(row.userId, rowsForUser);
  }
  return byUser;
}

function sampleTime(now, windowDays, random, dayIndex) {
  const dayStart = now - (windowDays - dayIndex) * dayMs;
  const hour = intBetween(random, 8, 21);
  const minute = intBetween(random, 0, 59);
  return dayStart + hour * 60 * 60 * 1000 + minute * 60 * 1000;
}

function personaDimensions(persona) {
  const dimensions = {
    power_users: ["activated", "pro", "low"],
    casual_users: ["evaluating", "free", "medium"],
    churned_users: ["at_risk", "free", "high"],
    trial_users: ["trial", "trial", "unknown"],
  };

  return dimensions[persona] ?? dimensions.casual_users;
}

function eventProperties(user, context, eventName, extra = {}) {
  const [lifecycleStage, planTier, riskSegment] = personaDimensions(user.persona);
  return compactObject({
    cohort: "cohort_1_sample",
    environment: "course_seed",
    source: "noted_main_seed_script",
    persona: user.persona,
    convex_user_id: user.userId,
    lifecycle_stage: lifecycleStage,
    risk_segment: riskSegment,
    plan_tier: planTier,
    activation_status: context.activationStatus,
    feature_area: context.featureArea,
    funnel_stage: context.funnelStage,
    seeded_document_count: context.documentCount,
    seeded_published_document_count: context.publishedDocumentCount,
    seeded_coworker_message_count: context.messageCount,
    event_name: eventName,
    ...extra,
  });
}

function makeEvent(eventName, time, user, eventPropertiesForEvent, sessionIndex) {
  return {
    user_id: user.userId,
    event_type: eventName,
    time,
    session_id: Math.floor(time / 60_000) * 60_000 + sessionIndex,
    platform: "Web",
    app_version: "cohort-seed-1",
    event_properties: eventPropertiesForEvent,
  };
}

function activationStatus(documentCount, publishedDocumentCount, messageCount) {
  if (publishedDocumentCount > 0) return "published";
  if (messageCount >= 50) return "chat_active_no_publish";
  if (documentCount > 0) return "created_not_published";
  return "new";
}

function generateEvents(plan, fixture, eventCatalog, options) {
  const random = mulberry32(20260519);
  const now = Date.now();
  const windowDays = options.days ?? plan.windowDays;
  const users = fixture.users.slice(0, options.users ?? plan.userCountTarget);
  const documentsByUser = indexByUser(fixture.documents);
  const messagesByUser = new Map(
    fixture.coworkerMessages.map((bucket) => [bucket.userId, bucket.count]),
  );
  const events = [];

  const push = (eventName, day, user, context, extra = {}, sessionIndex = 0) => {
    if (!eventCatalog.has(eventName)) return;
    const time = sampleTime(now, windowDays, random, day);
    events.push(
      makeEvent(
        eventName,
        time,
        user,
        eventProperties(user, context, eventName, extra),
        sessionIndex,
      ),
    );
  };

  for (const [userIndex, user] of users.entries()) {
    const documents = documentsByUser.get(user.userId) ?? [];
    const publishedDocuments = documents.filter((document) => document.isPublished);
    const messageCount = messagesByUser.get(user.userId) ?? 0;
    const signupDay = Math.min(windowDays - 1, intBetween(random, 0, 8) + (userIndex % 4));
    const baseContext = {
      documentCount: documents.length,
      publishedDocumentCount: publishedDocuments.length,
      messageCount,
      activationStatus: activationStatus(documents.length, publishedDocuments.length, messageCount),
    };

    push(
      "Landing Feature Page Visited",
      Math.max(0, signupDay - 1),
      user,
      { ...baseContext, featureArea: "acquisition", funnelStage: "visitor" },
      {
        feature_name: pick(random, ["AI Writing", "Editor", "Files", "Publish", "Search", "Squad"]),
        page_path: pick(random, [
          "/features/ai-writing",
          "/features/editor",
          "/features/files",
          "/features/publish",
          "/features/search",
          "/features/squad",
        ]),
      },
    );

    if (user.persona === "trial_users" || random() < 0.22) {
      push(
        "Hiring Vibe PMs Page Visited",
        Math.max(0, signupDay - 1),
        user,
        { ...baseContext, featureArea: "acquisition", funnelStage: "visitor" },
        { page_path: "/hiring-vibe-pms" },
        1,
      );
    }

    push(
      "User Logged In",
      signupDay,
      user,
      { ...baseContext, featureArea: "auth", funnelStage: "signup" },
      { auth_surface: "clerk" },
      2,
    );

    push(
      "AI Provider Tested",
      signupDay,
      user,
      { ...baseContext, featureArea: "ai_settings", funnelStage: "setup" },
      { ai_provider: user.aiProvider, success: true },
      3,
    );

    push(
      "AI Settings Updated",
      signupDay,
      user,
      { ...baseContext, featureArea: "ai_settings", funnelStage: "setup" },
      { ai_provider: user.aiProvider, ai_model: user.aiModel, model_changed: false },
      4,
    );

    for (const [docIndex, document] of documents.entries()) {
      const eventDay = Math.min(windowDays - 1, signupDay + 1 + (docIndex % 12));
      const documentProps = {
        document_id: document.seedKey,
        document_seed_key: document.seedKey,
        document_join_key: `${user.userId}:${document.title}`,
        document_title: document.title,
        is_published: document.isPublished,
        is_archived: document.isArchived,
      };

      push(
        "Document Created",
        eventDay,
        user,
        { ...baseContext, featureArea: "documents", funnelStage: "create" },
        documentProps,
        10 + docIndex,
      );

      if (document.isPublished) {
        push(
          "Document Published",
          Math.min(windowDays - 1, eventDay + 1),
          user,
          { ...baseContext, featureArea: "documents", funnelStage: "publish" },
          documentProps,
          100 + docIndex,
        );
      }
    }

    const coworkerEvents = Math.min(messageCount, user.persona === "power_users" ? 60 : 35);
    for (let index = 0; index < coworkerEvents; index += 1) {
      push(
        "Coworker Message Sent",
        Math.min(windowDays - 1, signupDay + 2 + (index % 18)),
        user,
        { ...baseContext, featureArea: "coworker", funnelStage: "assist" },
        {
          ai_provider: user.aiProvider,
          message_length_bucket: pick(random, ["<100", "100-500", "500+"]),
          message_sequence: index + 1,
        },
        200 + index,
      );
    }
  }

  return events.sort((a, b) => a.time - b.time);
}

async function postEvents(events) {
  if (!apiKey) {
    throw new Error("AMPLITUDE_API_KEY is required when applying the seed.");
  }

  for (let index = 0; index < events.length; index += 500) {
    const batch = events.slice(index, index + 500);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, events: batch }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Amplitude batch failed (${response.status}): ${body}`);
    }
  }
}

function printSummary(plan, events) {
  const byType = new Map();
  for (const event of events) {
    byType.set(event.event_type, (byType.get(event.event_type) ?? 0) + 1);
  }

  console.log("# Amplitude seed plan");
  console.log(`Cohort: ${plan.cohortName}`);
  console.log(`Events: ${events.length}`);
  console.log("");
  for (const [eventType, count] of [...byType.entries()].sort()) {
    console.log(`- ${eventType}: ${count}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const [planRaw, fixture, eventCatalog] = await Promise.all([
    readFile(planPath, "utf8").then(JSON.parse),
    readExpandedConvexFixture(fixturePath),
    readEventCatalog(),
  ]);
  const events = generateEvents(planRaw, fixture, eventCatalog, options);

  printSummary(planRaw, events);

  if (options.out) {
    await writeFile(options.out, JSON.stringify(events, null, 2), "utf8");
    console.log("");
    console.log(`Wrote ${options.out}`);
  }

  if (!options.apply) {
    console.log("");
    console.log("Dry run only. Set AMPLITUDE_API_KEY and run npm run seed:amplitude to apply.");
    return;
  }

  await postEvents(events);
  console.log("");
  console.log(`Sent ${events.length} events to Amplitude.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
