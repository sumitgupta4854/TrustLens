# TrustLens — AI-Powered Dating Safety Companion
> **"Don't Just Read the Message. Understand the Pattern."**

TrustLens helps users recognize potentially concerning patterns in online dating conversations, cross-reference behavior against their explicitly defined personal boundaries, prepare respectful responses, examine cross-conversation trends, and make more informed relationship decisions.

---

## 🌟 Core Product Differentiators

### 1. Boundary Tracker + Pattern Intelligence
Unlike basic sentiment analyzers that isolate individual messages, TrustLens focuses on **repeated patterns** (such as financial urgency, guilt-tripping, boundary testing after a refusal, intimate photo demands, and rushed intimacy) and directly compares dialogue against your **explicit personal boundaries** (e.g., *"I do not send money to someone I just met"*).

### 2. Multi-Conversation & Cross-Chat Intelligence Dashboard
A centralized analysis system synthesizing patterns across **all** your conversations:
- **Executive Holistic Synthesis**: Cross-chat risk assessment and sentiment progression.
- **Sentiment & Risk Distribution**: Visual breakdown of positive, neutral, cautious, and concerning dialogue.
- **Intent Analysis**: Dual-sided intent breakdown (user communication intent vs. counterparty behavioral intent).
- **Recurring Topics & Frequencies**: Tagged topic recurrences (Financial, Intimate Media, Emotional Pacing, Meeting Safety).
- **Cross-Conversation Repeated Patterns**: Uncovering tactics repeated by different matches.
- **Interactive Filtering**: Filter by date range (All time, 7 days, 30 days), concern level, or topic.
- **Deep Single Chat Inspector**: One-click modal to inspect granular evidence quotes, strength scores, and reply suggestions.

### 3. Dedicated Analysis Feature Dropdown
Organized into 3 logical categories:
- **Safety & Risk Audit**: General Safety & Risk Audit, Intimate Media & Coercion Defense, Financial Solicitations & Scam Detection.
- **Boundary & Communication Dynamics**: Boundary Respect & Pushback Tracker, Emotional Pacing & Love-Bombing Radar, Manipulation Tactics & Guilt Radar.
- **Contextual & Positive Signals**: First-Date & In-Person Safety Protocol, Healthy Green Flags & Reciprocal Respect.

### 4. Interactive AI Safety Chat (`/chat`)
A supportive, non-judgmental conversational assistant to talk through ambiguous interactions, formulate respectful boundary statements, or plan safe exits when uncomfortable.

### 5. Strict Privacy & Responsible AI Invariants
- **Zero Raw Text Storage**: User-submitted conversation transcripts are analyzed entirely in memory and immediately purged.
- **Opt-In Structured History**: Only when a user explicitly checks *"Save findings to private history"* does TrustLens persist structured findings and recommendations. The raw conversation text is **never** saved.
- **Responsible Evaluation**: TrustLens never claims to verify legal identity or conclusively determine character. Findings are categorized as **Low**, **Moderate**, or **High** concern based strictly on quoted excerpts from the supplied text.

---

## 🎨 Modern Midnight Teal + Warm Coral Design System

TrustLens features an accessible, high-contrast design system:
- **Midnight Teal Background**: `#101C22`
- **Dark Surfaces**: `#18272D`, `#22363C`
- **Soft Light Background**: `#F5F8F7`, `#FFFFFF`
- **Primary Teal**: `#19B7A5`, Deep Teal `#087F73`, Mint `#D9F5EE`
- **Warm Coral Accent**: `#FF806D`, Dark Coral `#DC4C37`
- **Navbar**: High-contrast, glassmorphism design with responsive mobile navigation drawer, clear interactive pill hover effects, and theme toggling.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Axios, Lucide React Icons |
| **Backend** | Node.js, Express.js, TypeScript, REST API architecture |
| **Database** | MongoDB Atlas, Mongoose ODM (ObjectIds, compound indexes, TTL support) |
| **Authentication** | JWT Access Tokens (15m in memory), Rotating Refresh Tokens (7d in HTTP-only cookies), Argon2/Bcrypt password hashing, Token Family Reuse Detection |
| **Security & Validation** | Zod schemas, Helmet security headers, Express Rate Limiter, CORS whitelist, Sensitive-data log redaction |
| **AI Integration** | OpenAI-compatible LLM endpoint (configurable) with automatic, high-precision rule-based Pattern Intelligence fallback |
| **Testing** | Vitest, Supertest, MongoMemoryServer (41 automated tests passing) |

---

## 📂 Project Structure

```
TRUSTLENS/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── analyzer/       # Feature Dropdown, Analysis Dashboard View, Results View, Cards
│   │   │   ├── layout/         # AppLayout, RouteLayouts, AppTopBar, AppSidebar
│   │   │   └── ui/             # High-contrast Button, Input, ThemeToggle, Card, Spinner, Alert
│   │   ├── contexts/           # AuthContext (token rotation), ThemeContext
│   │   ├── pages/              # Landing, Dashboard, ChatPage, Analyzer, Boundaries, Reply Coach, Checklist, History, Settings
│   │   ├── services/           # Axios client with automatic 401 token refresh interceptor
│   │   ├── styles/             # Tailwind CSS tokens & dark/light theme CSS variables
│   │   ├── types/              # TypeScript models (User, Boundary, AnalysisResult, MultiConversationReport)
│   │   └── utils/              # Fictional demo scenarios, color helpers, formatting
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── server/                     # Express + TypeScript + MongoDB API
│   ├── src/
│   │   ├── config/             # Database connection & Zod environment validation
│   │   ├── controllers/        # Auth, User, Boundary, Analyze, Chat, History, Health
│   │   ├── middleware/         # Auth verification, rate limiters, error handling
│   │   ├── models/             # User, RefreshSession, Boundary, SafetyAnalysis, Tokens
│   │   ├── routes/             # Express API routers (mounted in index.ts)
│   │   ├── services/           # AI LLM service, Rule-Based Pattern Intelligence, Email
│   │   ├── utils/              # Token hashing, logging with sensitive data redaction
│   │   ├── validators/         # Zod request & response schemas
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server bootstrap
│   ├── tests/                  # Vitest test suite with MongoMemoryServer (41 tests)
│   ├── tsconfig.json
│   └── package.json
├── .env.example                # Canonical environment variable template
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **pnpm**
- **MongoDB Atlas** connection string (or local MongoDB)

### 2. Environment Variables Configuration
Copy the `.env.example` in both server and client:
```bash
cp .env.example server/.env
```
Ensure `MONGODB_URI`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET` are configured. Optionally add `LLM_API_KEY` for OpenAI-compatible LLM inference. If no LLM key is configured, TrustLens runs entirely locally using its built-in rule-based Pattern Intelligence engine.

### 3. Installation
```bash
# Root install
npm run install:all
```

### 4. Running the Development Servers
```bash
# Starts Express API (:8787) and Vite Client (:5173) concurrently
npm run dev
```

### 5. Running Automated Tests
```bash
npm --prefix server test
```
All 41 tests across Authentication, Authorization, Pattern Intelligence, Multi-Conversation Intelligence, AI Chat, and Privacy Invariants run and pass.

---

## 🛡️ API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user & issue JWT
- `POST /api/auth/login` — Authenticate & set rotating refresh cookie
- `POST /api/auth/refresh` — Issue fresh access token via HTTP-only cookie
- `POST /api/auth/logout` — Terminate current session
- `POST /api/auth/logout-all` — Invalidate all active user sessions
- `GET /api/auth/me` — Retrieve current authenticated user profile

### AI Analysis & Multi-Chat Intelligence
- `POST /api/analyze` — Single conversation evaluation with boundary cross-check
- `POST /api/analyze/overview` — Multi-conversation synthesis, sentiment distribution, intent analysis, and cross-chat trends
- `POST /api/ai/chat` — Supportive AI Safety Chat companion

### Boundary Tracker
- `GET /api/boundaries` — List user personal boundaries
- `POST /api/boundaries` — Create boundary
- `PATCH /api/boundaries/:id` — Update boundary
- `DELETE /api/boundaries/:id` — Delete boundary

### History & User
- `GET /api/analyses` — List opt-in saved structured analysis records
- `GET /api/analyses/:id` — Inspect specific saved record
- `DELETE /api/analyses/:id` — Delete saved record
- `DELETE /api/users/me` — Permanently purge account and all data
