# GuideAI

**Turn device manuals into QR-code AI assistants for hotels, rentals, offices, and real-world equipment.**

A guest should not read a 100-page PDF to use an air conditioner.
A new employee should not call a manager to understand a printer.
A customer should not wait for support to decode a blinking error light.

**GuideAI lets you upload a manual, attach it to a device, generate a QR code, and give people instant answers exactly where the problem happens.**

[![Version](https://img.shields.io/badge/version-1.1.8-blue.svg)](https://github.com/HuckleR2003/guide-ai/releases)
[![Status](https://img.shields.io/badge/status-active%20development-8b5cf6.svg)](#project-status)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](#license)

**Live demo:** [guide-ai-gold.vercel.app](https://guide-ai-gold.vercel.app)

<img width="1194" height="558" alt="GuideAI Overview" src="https://github.com/user-attachments/assets/1295c720-a850-4a01-843a-1424e967a89f" />

---

## The idea

Most manuals are written for storage, not for use.

They sit in drawers, inboxes, PDF folders, hotel binders, and forgotten support pages.
But people need help while standing in front of the device.

GuideAI turns those manuals into **scannable AI helpers**.

```text
Upload manual -> Create device -> Generate QR code -> Scan and ask
```

Instead of searching through pages, users can ask:

* "How do I reset this device?"
* "What does this error code mean?"
* "How do I connect it to Wi-Fi?"
* "How do I clean it safely?"
* "Why is this light blinking?"
* "How do I use this machine for the first time?"

---

## Built for real places

GuideAI is designed for environments where the same questions repeat every day.

### Hotels and apartments

Place QR codes near devices in rooms:

* air conditioners
* coffee machines
* safes
* TVs
* washing machines
* smart locks
* heating panels

Guests scan the QR code and get device-specific help without messaging reception.

### Offices and workplaces

Attach QR assistants to:

* printers
* scanners
* meeting room equipment
* access systems
* kitchen devices
* internal tools

Employees get answers without interrupting someone else.

### Service, rental, and support teams

Use GuideAI for equipment that customers or staff need to operate correctly:

* rental devices
* workshop machines
* gym equipment
* self-service stations
* onboarding materials
* technical documentation

---

## How it works!

### 1. Upload a PDF manual

Add a manual, guide, instruction sheet, or technical document.

### 2. Create a device

Give the manual a real-world identity:

```text
Room 204 - Air Conditioner
Office Printer - 2nd Floor
Apartment A3 - Washing Machine
Workshop - Laser Cutter
```

### 3. Generate a QR code

GuideAI creates a QR code that can be printed, placed near the device, or shared digitally.

### 4. Ask questions

The user scans the QR code and asks natural-language questions based on the uploaded manual.

---

## Why GuideAI exists

PDF manuals are technically available.

That does not mean they are usable.

GuideAI is built around a simple belief:

> The best manual is the one that answers the exact question at the exact place where the user needs it.

No searching.
No scrolling through 100 pages.
No generic chatbot guessing from the internet.
No "please contact support" for every basic question.

Just the right answer, from the right manual, attached to the right device.

---

## Features

* **PDF manual upload**
* **AI-powered manual chat**
* **Device management**
* **QR code generation**
* **Persistent device records**
* **User dashboard**
* **Email authentication**
* **Google OAuth**
* **English and Polish interface**
* **Dark mode**
* **Hosted live on Vercel**
* **Supabase-backed storage and authentication**

---

## Tech stack

GuideAI is built with a modern web stack:

| Layer            | Technology                  |
| ---------------- | --------------------------- |
| Frontend         | React 19, Vite              |
| Styling          | Tailwind CSS                |
| Auth & Database  | Supabase                    |
| AI               | Groq API / Llama 3.1        |
| Hosting          | Vercel                      |
| Language support | EN / PL                     |
| QR flow          | Device-linked QR generation |

---

## Screenshots

> Add screenshots or GIFs here to make the repository instantly understandable.

```md
![GuideAI dashboard](./docs/screenshots/dashboard.png)
![Device QR assistant](./docs/screenshots/device-qr.png)
![Manual chat](./docs/screenshots/manual-chat.png)
```

Recommended visuals:

1. Landing page
2. PDF upload flow
3. Device dashboard
4. Generated QR code
5. AI chat answering a manual-specific question

---

## Example use case

A small hotel has 20 rooms.

Each room has:

* a TV
* an air conditioner
* a safe
* a coffee machine
* a heating controller

Instead of leaving paper instructions or answering the same messages every week, the hotel creates QR assistants for each device.

A guest scans the code next to the air conditioner and asks:

```text
How do I switch this to cooling mode?
```

GuideAI answers from the actual manual.

The hotel gets fewer repeated questions.
The guest gets help instantly.
The staff stays focused on real problems.

---

## Project status

GuideAI is in active development.

Current version:

```text
v1.1.8
```

Recent work includes:

* Supabase authentication
* Google OAuth integration
* user profiles
* dashboard foundation
* device management
* QR generation flow
* session persistence
* improved landing page
* FAQ section
* footer and UI polish

Next focus areas:

* stronger QR persistence
* improved database structure
* better PDF processing pipeline
* production-ready device sharing
* cleaner onboarding for business users
* demo flows for hotels, rentals, and offices

---

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/HuckleR2003/guide-ai.git
cd guide-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Depending on your current AI provider setup, also configure the required API key for the AI chat backend.

### 4. Run locally

```bash
npm run dev
```

The app should be available at:

```text
http://localhost:5173
```

---

## Supabase setup

GuideAI uses Supabase for authentication, user data, and device persistence.

See:

```text
SUPABASE_SETUP.md
```

for database schema and configuration notes.

---

## Roadmap

### Product

* [ ] Business-ready demo mode
* [ ] Public device assistant pages
* [ ] Shareable QR assistant links
* [ ] Better onboarding for hotels and rentals
* [ ] Device groups / locations
* [ ] Organization accounts
* [ ] Usage analytics
* [ ] Custom branding for businesses

### AI and documents

* [ ] Improved PDF parsing
* [ ] Better source-grounded answers
* [ ] Manual section references
* [ ] Multi-document device knowledge
* [ ] Safer fallback when the manual does not contain an answer
* [ ] More reliable long-manual handling

### Operations

* [ ] Production database cleanup
* [ ] Better error handling
* [ ] Rate limit protection
* [ ] Billing-ready architecture
* [ ] Exportable QR sheets
* [ ] Admin tools for managing devices

---

## Philosophy

GuideAI is not trying to replace support teams.

It is trying to remove the questions that should never have reached support in the first place.

If the answer is already buried inside a manual, GuideAI should make it available in seconds.

---

## Author

Built by **Marcin Firmuga / HCK_Labs**.

GuideAI is part of the HCK_Labs build-in-public journey: practical tools, real users, and software that solves annoying everyday problems.

---

## License

MIT License.

Copyright © 2026 HCK_Labs.
