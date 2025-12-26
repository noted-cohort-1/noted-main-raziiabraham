# AI Features Specification

## Overview
Users can use AI to automatically create new pages or improve existing ones. They bring their own API key from OpenAI, Anthropic, or other AI providers, so they control costs and privacy.

## Why We Need This
- **Speed**: Users can create content faster
- **Quality**: AI helps improve writing and organization
- **Flexibility**: Users choose their own AI provider and control their spending

---

## ✅ **MVP IMPLEMENTATION STATUS** (December 2025)

### What's Currently Built

#### 1. **AI Settings & API Key Management** ✅
- **Location**: Settings page → AI tab
- **Features Implemented**:
  - Secure API key storage (encrypted via Convex)
  - Model selection (gpt-4o-mini, gpt-4o, gpt-4-turbo, gpt-3.5-turbo, o1-mini, o1-preview, gpt-4)
  - Backend API key encryption/decryption via Convex actions
  - Test connection before saving
- **Technical Stack**:
  - `convex/aiSettings.ts` - Encryption/decryption actions
  - `app/(main)/_components/AISettings.tsx` - Settings UI
  - Server-side only (keys never exposed to client)

#### 2. **BlockNote Editor with AI Extension** ✅
- **Integration**: Using `@blocknote/xl-ai` (v0.45.0)
- **Features Implemented**:
  - Seamless AI integration within BlockNote editor
  - AI agent cursor (blue highlight) during generation
  - Streaming responses from OpenAI
  - Accept/Reject/Retry UI after AI generates content
- **Technical Stack**:
  - `components/editor.tsx` - Main editor with AI extension
  - `lib/serverSideTransport.ts` - Custom transport with Convex auth
  - `app/api/ai/chat/route.ts` - API route following BlockNote pattern

#### 3. **Ask AI Slash Command** ✅
- **Usage**: Type `/` → Select "Ask AI"
- **Features Implemented**:
  - Input prompt dialog appears inline
  - Supports quick commands:
    - Continue writing
    - Make shorter
    - Proofread
  - AI generates content with context awareness (cursor position, selection)
  - Accept ✓ / Reject ✗ / Retry ↻ buttons after generation
- **User Experience**:
  - No page refresh needed
  - Works inline in the editor
  - Real-time streaming of AI responses
  - Visual feedback with blue agent cursor

#### 4. **Server-Side AI Processing** ✅
- **Architecture**: 
  - Client → API Route → Convex (get API key) → OpenAI → Stream back
  - All AI requests authenticated via Clerk tokens
  - Debounced document saves (1s delay) to prevent overwhelm
- **API Route**: `/api/ai/chat`
  - Uses Vercel AI SDK (`ai` package v5.0.116)
  - Implements BlockNote official pattern:
    - `toolDefinitionsToToolSet` - Converts tool definitions
    - `injectDocumentStateMessages` - Adds document context
    - `aiDocumentFormats.html.systemPrompt` - Uses BlockNote prompts
  - Streams responses via `UIMessageStreamResponse`

---

## 🚧 **NOT YET IMPLEMENTED** (Planned Features)

The following features from the original spec are **not yet built**:

### Slash Commands (Advanced)
- ❌ `/ai write` - Generate content from prompt
- ❌ `/ai summarize` - Summarize selected text/page
- ❌ `/ai improve` - Enhance writing quality
- ❌ `/ai tone` - Change tone (professional, casual)
- ❌ `/ai translate` - Translate to another language
- ❌ `/ai brainstorm` - Generate ideas

### Create Page with AI
- ❌ "Create with AI" button in new page menu
- ❌ Full page generation from prompt
- ❌ Suggested icon generation

### Inline AI Suggestions
- ❌ Auto-completion as you type
- ❌ Hover menu on paragraphs for quick actions
- ❌ Purple highlighted suggestions
- ❌ Tab to accept, Escape to reject

### Update Page with AI
- ❌ Right-click menu for selected text
- ❌ Floating toolbar with AI options
- ❌ In-place change preview

### Ask AI About Page (Chat Panel)
- ❌ Persistent inline chat panel
- ❌ Chat history per page
- ❌ "Insert into page" button for responses

### AI Templates
- ❌ Pre-built prompts for common tasks
- ❌ Custom template saving
- ❌ Team template sharing

---

## User Flow (MVP)

### Setting Up AI
1. User goes to Settings (gear icon in sidebar)
2. Clicks "AI" tab
3. Selects AI model (e.g., gpt-4o-mini)
4. Pastes OpenAI API key
5. Clicks "Save AI Settings"
6. System encrypts key and stores in Convex
7. Success message confirms settings saved

### Using AI in Editor
1. User opens a document
2. Places cursor where they want AI to generate
3. Types `/` to open slash menu
4. Selects "Ask AI" from menu
5. Input prompt appears (e.g., "Continue writing")
6. Types prompt or selects quick command
7. Presses Enter
8. AI generates content (shows blue agent cursor)
9. Accept/Reject/Retry buttons appear
10. User clicks Accept ✓ to insert content

---

## Technical Requirements (MVP)

### API Integration
- ✅ OpenAI API support via `@ai-sdk/openai`
- ✅ Secure key storage (Convex encrypted fields)
- ✅ Error handling for API failures
- ✅ Streaming responses (async)
- ❌ Anthropic API (planned)
- ❌ Rate limiting

### User Interface
- ✅ Settings page for API key management
- ✅ Slash command menu (`/`) with AI option
- ✅ Accept/Reject/Retry buttons via `AIMenuController`
- ✅ Blue agent cursor for AI writing
- ✅ Loading states during generation
- ❌ Floating toolbar for text selection
- ❌ Inline chat panel
- ❌ Keyboard shortcuts for AI actions

### Data & Privacy
- ✅ API keys encrypted in Convex database
- ✅ Keys processed server-side only
- ✅ All AI requests via backend API route
- ✅ Convex auth tokens for request verification
- ❌ Option to delete AI data
- ❌ AI usage analytics

### Performance
- ✅ Debounced saves (1s delay)
- ✅ Streaming responses (30s max duration)
- ✅ Progress indicators (agent cursor)
- ❌ Response caching
- ❌ Request size limits

---

## Technical Architecture (MVP)

### File Structure
```
app/
├── api/ai/chat/route.ts          # AI API route (BlockNote pattern)
├── (main)/_components/
│   └── AISettings.tsx             # AI settings UI
components/
├── editor.tsx                      # BlockNote editor with AI
lib/
└── serverSideTransport.ts         # Custom AI transport with auth
convex/
└── aiSettings.ts                   # Encryption/decryption
```

### Key Dependencies
- `@blocknote/xl-ai` (v0.45.0) - AI editor extension
- `@blocknote/xl-ai/server` - Backend utilities
- `ai` (v5.0.116) - Vercel AI SDK
- `@ai-sdk/openai` - OpenAI integration
- `convex` - Backend with auth & encryption

### Data Flow
```
User types /
  ↓
SlashMenuWithAI (shows "Ask AI")
  ↓
AIMenuController (prompt input)
  ↓
AIExtension.invokeAI()
  ↓
ServerSideTransport
  ↓
/api/ai/chat (with Clerk token)
  ↓
Convex (decrypt API key)
  ↓
OpenAI API
  ↓
Stream response back
  ↓
AIMenuController (Accept/Reject UI)
```

---

## Success Criteria (MVP)

### User Experience
- ✅ Users can set up AI in under 2 minutes
- ✅ AI generation takes less than 10 seconds
- ⏳ Acceptance rate tracking (not yet measured)
- ✅ Clear error messages for setup issues

### Technical
- ✅ API key encryption working 100%
- ✅ StreamText integration functional
- ✅ Accept/Reject UI displaying correctly
- ✅ No keys exposed to client side
- ⏳ Error rate monitoring (not yet tracked)

### Business
- ⏳ User adoption metrics (not yet tracked)
- ⏳ Pages created with AI (not yet measured)
- ⏳ User feedback collection (planned)

---

## Future Enhancements

### Short-term (Next 3 months)
- Text selection → AI improvement menu
- Additional slash commands (summarize, translate, improve)
- Anthropic Claude support
- AI usage tracking and analytics
- Response caching for common prompts

### Long-term (6+ months)
- AI auto-completion as you type (like Copilot)
- Custom slash commands
- AI-powered search
- Voice-to-page transcription
- Meeting assistant (transcribe + summarize)
- Batch operations on multiple pages
- Smart templates that adapt
- AI-generated page linking

---

**Last Updated**: December 26, 2025

**Status**: MVP Launched - Core AI features functional

**Current Version**: 1.0 (BlockNote AI Integration)
