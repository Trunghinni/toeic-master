# 🎓 TOEIC Master

> Nền tảng học TOEIC toàn diện — luyện đủ 4 kỹ năng, flashcard SRS, ngân hàng đề thi, AI chấm điểm, học nhóm realtime.

[![CI](https://github.com/your-org/toeic-master/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/toeic-master/actions/workflows/ci.yml)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) · TypeScript · TailwindCSS · shadcn/ui |
| State | Zustand · TanStack Query |
| Backend | NestJS · TypeScript · REST + Swagger |
| Database | PostgreSQL 16 (Prisma ORM) |
| Cache | Redis 7 |
| Realtime | Socket.io |
| Auth | JWT + OAuth2 (Google) via Passport.js · RBAC |
| AI Speaking | Whisper STT + pronunciation scoring model |
| AI Writing | Claude API with TOEIC Writing rubric |
| Testing | Jest · Playwright (E2E) |
| CI/CD | GitHub Actions |

---

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0 (`npm i -g pnpm`)
- **Docker Desktop** (for Postgres + Redis)

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-org/toeic-master.git
cd toeic-master
pnpm install
```

### 2. Environment Variables

```bash
cp .env.example .env
# Edit .env and fill in the required values (see section below)
```

**Minimum required for local dev (Phase 0):**

```env
DATABASE_URL="postgresql://toeic:toeic_secret@localhost:5432/toeic_master"
REDIS_URL="redis://localhost:6379"
JWT_ACCESS_SECRET="your-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
```

### 3. Start Infrastructure

```bash
pnpm docker:up
# Waits for Postgres + Redis to be healthy
```

### 4. Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# (Optional) Open Prisma Studio to inspect DB
pnpm prisma:studio
```

### 5. Start Development Servers

```bash
# Start both FE and BE in watch mode
pnpm dev

# Or start individually:
pnpm --filter @toeic-master/api dev     # NestJS on :3001
pnpm --filter @toeic-master/web dev     # Next.js on :3000
```

### 6. Verify

| URL | Description |
|---|---|
| `http://localhost:3000` | Frontend (landing page) |
| `http://localhost:3001/api/health` | Backend health check |
| `http://localhost:3001/api/docs` | Swagger UI (dev only) |
| `http://localhost:5555` | Prisma Studio (run `pnpm prisma:studio`) |

---

## Project Structure

```
toeic-master/
├── apps/
│   ├── web/          # Next.js 14 frontend
│   └── api/          # NestJS backend
├── packages/
│   ├── shared-types/ # Shared DTOs & interfaces (FE ↔ BE)
│   ├── ui/           # Design system components
│   └── config/       # Shared ESLint, TSConfig, Tailwind
├── prisma/
│   └── schema.prisma # Database schema (single source of truth)
├── docker-compose.yml
├── turbo.json
└── pnpm-workspace.yaml
```

---

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all apps |
| `pnpm lint` | Run ESLint across all packages |
| `pnpm test` | Run all unit tests |
| `pnpm docker:up` | Start Postgres + Redis |
| `pnpm docker:down` | Stop all containers |
| `pnpm prisma:generate` | Generate Prisma client |
| `pnpm prisma:migrate` | Run DB migrations |
| `pnpm prisma:studio` | Open Prisma Studio UI |

---

## Development Phases

| Phase | Status | Description |
|---|---|---|
| Phase 0 | ✅ Done | Monorepo setup, Prisma schema, NestJS/Next.js skeleton |
| Phase 1 | 🔜 Next | Auth, Placement Test, Roadmap, Dashboard |
| Phase 2 | ⏳ | Flashcard + SRS |
| Phase 3 | ⏳ | Grammar Cards + Exercises |
| Phase 4 | ⏳ | Test bank + TOEIC scoring |
| Phase 5 | ⏳ | Listening & Reading |
| Phase 6 | ⏳ | Speaking & Writing (AI grading) |
| Phase 7 | ⏳ | Social + Gamification |
| Phase 8 | ⏳ | Admin CMS + Subscription |
| Phase 9 | ⏳ | PWA, performance, SEO |

---

## Contributing

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical decisions.
