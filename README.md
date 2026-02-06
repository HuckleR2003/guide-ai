# GuideAI

**Turn PDF manuals into AI-powered QR assistants.**

[![Version](https://img.shields.io/badge/version-1.1.8-blue.svg)](https://github.com/HuckleR2003/guide-ai/releases)

**Live:** [guide-ai-gold.vercel.app](https://guide-ai-gold.vercel.app)

## Tech Stack

React 19 | Vite | Tailwind CSS | Supabase | Groq API | Vercel

## Features

- PDF upload & AI chat (Groq Llama 3.1)
- QR code generation
- Auth (Email + Google OAuth)
- User dashboard
- i18n (EN/PL) + Dark mode

## v1.1.8 (04.02.2026)

- Supabase auth integration
- User profiles & dashboard
- Device management (save/view/delete QR)
- Session persistence
- UI: How It Works, FAQ accordion, improved Footer

**Status:** Database optimization in progress. Full QR persistence in v1.2.0.

## Setup

```bash
npm install
npm run dev
```

```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for database schema.

## License

MIT - HCK_Labs 2026
