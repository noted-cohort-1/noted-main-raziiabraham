---
type: faq
feature: ai-features
last_updated: 2026-04-17
---

# AI Features — FAQ

Top questions customers ask about the AI surface, with our official answers. Append as new ones come in — don't let CS re-discover.

### Do I need an API key to use AI in Noted?

Yes. Go to Settings → AI, pick a provider (OpenAI, Anthropic, or Google), paste your key, and choose a model. Your key is encrypted at rest in our database.

### Can I test my key before saving it?

Yes. The settings modal has a "Test connection" button that validates the key against the provider before saving.

### Can I use multiple providers?

Yes. You can save keys for all three (OpenAI, Anthropic, Google) and switch the active provider + model anytime. The settings modal shows which providers currently have saved keys.

### What's the difference between "Ask AI" in the editor and the Coworker chat?

- **Ask AI** (in-editor): you invoke it via `/` → "Ask AI" while writing a document. It generates content *inside the document* at your cursor. Great for drafting, rewriting a paragraph, expanding a bullet.
- **Coworker chat** (floating panel): persistent chat at the bottom-right. You talk to an agent — which can read, write, edit, list, or search your documents. Great for higher-level tasks like "summarize my last 5 meeting notes" or "find every doc mentioning pricing."

### What are Squad Agents?

Custom AI agents you define. Each has a name, emoji icon, and an instruction document. The document contains the agent's system prompt — you write whatever instructions you want, and the agent uses that when you chat with it. The document's first "Summary" heading becomes the agent's short description in the UI.

### How do I create a Squad Agent?

Open the sidebar → "AI Squad" (or visit `/coworkers`). Click "Add Agent". Noted creates the agent plus a linked instruction document. Open the document to write the agent's instructions.

### Can agents do anything besides chat?

Yes, within your workspace. Agents can:
- Read a document
- Write a new document
- Edit an existing document
- List your documents
- Search your documents

Agents do not currently connect to external tools (Slack, Linear, etc.).

### Does Noted train models on my data?

No. Noted does not use your content for training. When you invoke AI, your prompt and the relevant document context are sent to the provider (OpenAI, Anthropic, or Google) using *your* API key, under their data policy.

### Which models give the best results?

Depends on the task. Our general recommendations today:
- Writing in the editor: Claude Sonnet / Opus 4.5+, GPT-4o.
- Agents with tool calls: Claude Sonnet / Opus, Gemini 2.5 with thinking enabled.
- Cost-sensitive / quick turns: GPT-4o-mini, Claude Haiku, Gemini Flash.

Your mileage varies by prompt. Experiment.

### Can I upload files to a Squad Agent?

Yes. The Coworker chat supports multipart messages (text + image + file). The agent receives the attachment alongside your message.

### Why can't I see inline auto-complete?

That's not a feature in Noted today. AI is *explicit* — you invoke it via `/` → "Ask AI" or the Coworker panel. We've kept it this way intentionally to avoid the noise of always-on suggestions. If this matters to you, let us know.

### Will you add MCP / external tool connections?

Possibly. The agent framework we built (`lib/agent/`) uses a tool-loop pattern that could extend to MCP. It's not on the near-term roadmap. Ping product if it's critical.

### Is there a free AI tier?

Users currently supply their own API key — Noted does not meter AI usage through a shared key. If you don't have a key, you'll see a prompt to set one up the first time you invoke AI.

---

*Missing something? Add it. Or ping `@raziiabraham` and the next person who gets this question will find it here.*
