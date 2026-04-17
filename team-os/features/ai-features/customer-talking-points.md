---
type: customer-talking-points
feature: ai-features
last_updated: 2026-04-17
---

# AI Features — Customer Talking Points

For CS, sales, and anyone talking to a user about Noted's AI surface. Use these verbatim when you can. When a customer asks something not covered here, append to [faq.md](faq.md) so the next person doesn't have to re-invent the answer.

## Positioning in one sentence

> Noted has AI built in at two levels: a rich **in-editor** experience for writing with AI, and a **Coworker chat** with custom AI agents you define. Bring your own OpenAI, Anthropic, or Google API key and you control the model.

## What to say

**"Does Noted have AI?"**
> Yes. You can invoke AI directly in the editor with the `/` slash menu, and there's a dedicated Coworker chat panel where you can talk to AI agents with custom instructions. Three providers are supported: OpenAI, Anthropic, and Google.

**"Can I use my own API key?"**
> Yes. In fact we require it today. Go to Settings → AI, pick your provider, paste your key, and choose a model. Your key is encrypted server-side.

**"Which models do you support?"**
> OpenAI (GPT-4o, GPT-5.x families), Anthropic (Claude Opus / Sonnet / Haiku 4.5 and 4.6), and Google (Gemini 2.5 and 3.x, including thinking modes). The full list is in the model dropdown in Settings.

**"What can the AI do in the editor?"**
> Hit `/` in any document, pick "Ask AI", and write a natural-language prompt. It generates content inline with a blue agent cursor. You can accept, reject, or retry.

**"What are these 'Squad Agents'?"**
> Custom AI agents you define. Each agent has a name, icon, and instruction document — the instruction document's "Summary" heading shows up as the agent's description. Agents can read, write, edit, list, and search your documents through the Coworker chat.

**"Does Noted train on my data?"**
> No. Noted does not use your documents to train models. When you use AI, your prompt and the relevant document content are sent to whichever provider you chose (OpenAI, Anthropic, or Google) under that provider's data-handling policy, using your API key.

## What NOT to say

- ❌ "We have inline auto-complete." *(We don't — Ask AI is explicit, not ambient.)*
- ❌ "Our agents connect to Slack / Linear / Notion / anywhere else." *(Tools today are workspace-only: read / write / edit / list / search docs.)*
- ❌ "We meter AI usage." *(Users bring their own key. We don't proxy usage today.)*
- ❌ "Our AI can generate full pages from scratch with one click." *(It can generate content inside a document, but there's no "new page from prompt" home-screen CTA yet.)*
- ❌ Anything about MCP, Adology, or a "four-output" framework from the old spec. Those plans didn't ship in the current form.

## Escalation

If a customer hits something you can't answer from `faq.md` or `status.md`, ping `@raziiabraham` (product) or `@avidx-app` (engineering). Then append the question + answer to `faq.md` so it becomes a known answer.
