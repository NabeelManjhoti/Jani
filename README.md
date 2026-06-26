# Jani — Karachi ka Asli Dost

Hyper-local AI guide to Karachi. Speaks Roman Urdu, knows every food spot, traffic shortcut, and cultural landmark. Built by Nabeel Manjhoti.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 + CSS Variables (dark/light theme)
- **AI**: Vercel AI SDK + Gemini 2.5 Flash (via OpenAI-compatible endpoint)
- **Auth**: Supabase (Google OAuth)
- **Database**: Supabase PostgreSQL (chats + messages)
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and Gemini API key

# Run dev server
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `GEMINI_API_KEY` | Google AI API key (for Gemini) |

## Database Setup

Run `supabase-schema.sql` in your Supabase SQL Editor. This creates:
- `profiles` table (auto-populated via trigger)
- `chats` table
- `messages` table
- RLS policies
- Trigger for new user profiles

Enable Google OAuth in Supabase Auth settings.

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts    # AI chat API with streaming
│   ├── auth/                # Sign in page + callback
│   ├── chat/                # Chat interface
│   └── page.tsx             # Landing page
├── components/
│   ├── chat-sidebar.tsx     # Chat history sidebar
│   ├── chat-interface.tsx   # Main chat area
│   ├── chat-input.tsx       # Message input
│   ├── chat-message.tsx     # Message bubble
│   ├── navbar.tsx           # Top navigation
│   └── theme-provider.tsx   # Dark/light theme
└── lib/supabase/
    ├── client.ts            # Browser client
    ├── server.ts            # Server client
    ├── middleware.ts         # Supabase SSR middleware
    └── queries.ts           # DB query helpers
```

## Deployment

1. Push to GitHub
2. Import on Vercel
3. Set environment variables
4. Deploy
