# Jani — Karachi ka Asli Dost

Hyper-local AI guide to Karachi. Speaks Roman Urdu, knows every food spot, traffic shortcut, and cultural landmark. Built by Nabeel Manjhoti.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 + CSS Variables (dark/light theme)
- **AI**: Vercel AI SDK + Google Gemini 2.5 Flash (via `@ai-sdk/google`)
- **Auth**: NextAuth v5 — Credentials (email/password, bcrypt), JWT sessions
- **Database**: Neon (serverless PostgreSQL) via `@neondatabase/serverless`
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy and fill environment variables
cp .env.example .env.local
```

## Environment Variables

| Variable | Description |
|---|---|
| `NEON_DATABASE_URL` | Neon PostgreSQL connection string |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key (for Gemini) |
| `NEXTAUTH_SECRET` | NextAuth encryption secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` for dev) |

## Database Setup

1. Create a free project on [neon.tech](https://neon.tech)
2. Copy your connection string and paste it as `NEON_DATABASE_URL`
3. Open **Neon SQL Editor** and run `neon-schema.sql`
4. This creates `users`, `chats`, and `messages` tables

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── auth/signup/         # Signup API (bcrypt + Neon insert)
│   │   ├── chat/                # AI chat API with streaming
│   │   ├── chats/               # Chat CRUD API
│   │   └── messages/            # Messages API
│   ├── auth/                    # Sign in / Sign up page
│   ├── chat/                    # Chat interface
│   └── page.tsx                 # Landing page
├── components/
│   ├── chat-sidebar.tsx         # Chat history sidebar
│   ├── chat-interface.tsx       # Main chat area
│   ├── chat-input.tsx           # Message input
│   ├── chat-message.tsx         # Message bubble
│   ├── navbar.tsx               # Top navigation
│   └── theme-provider.tsx       # Dark/light theme
├── lib/
│   ├── db.ts                    # Neon connection (tagged-template SQL)
│   └── auth.ts                  # NextAuth config
├── middleware.ts                 # Auth middleware
└── types/next-auth.d.ts          # Session type augmentation
```

## Deployment

1. Push to GitHub
2. Import on Vercel
3. Set all 4 environment variables in Vercel dashboard
4. Deploy
