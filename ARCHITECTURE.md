# TOEIC Master — Architecture Document

> Living document — updated after each Phase.
> Last updated: Phase 1

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client (Browser / PWA)                       │
│                    Next.js 14 — App Router + TypeScript              │
│              TailwindCSS · shadcn/ui · Zustand · TanStack Query      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS + REST (JSON)
                                │ WebSocket (Socket.io)
┌───────────────────────────────▼─────────────────────────────────────┐
│                         API Layer (NestJS)                            │
│                    Domain-modular · Swagger/OpenAPI                   │
│                 Passport.js (JWT + Google OAuth) · RBAC              │
│              BullMQ queues for AI grading + audio processing          │
└──────────┬──────────────────┬──────────────────┬────────────────────┘
           │                  │                  │
    ┌──────▼──────┐   ┌───────▼──────┐  ┌───────▼──────┐
    │  PostgreSQL  │   │    Redis      │  │  S3-compat   │
    │  (Prisma)    │   │ Cache + Queue │  │  (Media)     │
    │  Primary DB  │   │  + Realtime  │  │  Audio/Image │
    └─────────────┘   └──────────────┘  └──────────────┘
           │
    ┌──────▼──────────────────────────┐
    │          AI Services            │
    │  Whisper STT (Speaking)         │
    │  Claude API (Writing rubric)    │
    │  Azure Speech (pronunciation)   │
    └─────────────────────────────────┘
```

---

## 2. Tech Stack Decisions

### Frontend (Next.js 14 App Router)
- **Why App Router**: Server Components reduce JS bundle; RSC for SEO-critical pages (landing, vocabulary lists); layouts reduce re-renders.
- **Zustand**: Lightweight client state (auth token, UI preferences, flashcard session). No context boilerplate.
- **TanStack Query**: Server state management, caching, optimistic updates for test attempts.
- **shadcn/ui**: Accessible, unstyled Radix primitives — customized to brand without fighting a design system.
- **Recharts**: Dashboard radar chart, score history line chart.

### Backend (NestJS)
- **Module-per-domain**: `AuthModule`, `UserModule`, `VocabularyModule`, `GrammarModule`, `TestModule`, `SpeakingModule`, `WritingModule`, `SocialModule`, `AdminModule`, `NotificationModule`.
- **Service layer**: Controllers are thin (validate → delegate to service). Services own business logic. Repositories (via Prisma) own DB access.
- **BullMQ**: AI grading is async — user submits, gets `submissionId`, polls `/submissions/:id/status`. Queue prevents API timeouts on AI calls.
- **Socket.io namespaces**: `/study-room` (group sessions), `/challenge` (1v1), `/notifications`.

### Database (PostgreSQL + Prisma)
- Single `prisma/schema.prisma` at repo root — shared across all apps.
- **Index strategy**: `userId` on all user-owned tables, `nextReviewAt` for SRS scheduling, `(userId, completedAt)` for test history time-series.
- **JSON columns**: Used for flexible structures: `TestQuestion.options`, `TestAttempt.partBreakdown`, `Achievement.requirement`, `WritingTask.rubric`. Avoids over-normalization for rarely-queried sub-structures.

### Auth (JWT + RBAC)
- **Access token**: 15-minute expiry, stored in memory (Zustand). Never in localStorage.
- **Refresh token**: 7-day expiry, stored in `httpOnly` cookie. Rotated on each use.
- **RBAC roles**: `ADMIN` (full access), `CONTENT_EDITOR` (CRUD content, no user management), `USER` (standard access).

### AI Grading Pipeline
```
[User submits audio/text]
        │
        ▼
[API creates Submission record: status=pending]
        │
        ▼
[BullMQ job enqueued]
        │
        ▼ (async worker)
[STT / LLM API called with rubric]
        │
        ▼
[Submission updated: status=done, scores saved]
        │
        ▼
[Socket.io push to user's room]
```

### SRS Algorithm (SM-2)
Implemented in `VocabularyService.reviewCard()`:

```
Input: quality q ∈ {0,1,2,3,4,5}

If q >= 3 (successful recall):
  if repetitions == 0: interval = 1
  elif repetitions == 1: interval = 6
  else: interval = round(prev_interval × EF)
  repetitions += 1

If q < 3 (failed):
  repetitions = 0
  interval = 1

EF = max(1.3, EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02)))
nextReviewAt = now + interval days
```

### TOEIC Score Conversion
`TestAttempt` stores raw correct counts per Part. Scaled score computed using the official TOEIC conversion table (stored as a constant in `shared-types`):
- Listening: Parts 1–4, scaled 5–495
- Reading: Parts 5–7, scaled 5–495
- Total: 10–990

---

## 3. Monorepo Structure

```
toeic-master/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages & layouts
│   │   │   ├── components/       # React components
│   │   │   │   ├── ui/           # shadcn/ui base components
│   │   │   │   ├── features/     # Feature-specific components
│   │   │   │   └── layout/       # Nav, Sidebar, Footer
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── lib/              # Utilities, API client, constants
│   │   │   └── stores/           # Zustand stores
│   │   ├── public/
│   │   ├── next.config.ts
│   │   └── tailwind.config.js
│   └── api/
│       └── src/
│           ├── common/           # Prisma, guards, decorators, pipes
│           │   ├── config/
│           │   ├── guards/
│           │   ├── decorators/
│           │   ├── filters/
│           │   └── prisma/
│           ├── health/
│           └── modules/
│               ├── auth/
│               ├── user/
│               ├── vocabulary/   # Phase 2
│               ├── grammar/      # Phase 3
│               ├── test/         # Phase 4
│               ├── listening/    # Phase 5
│               ├── reading/      # Phase 5
│               ├── speaking/     # Phase 6
│               ├── writing/      # Phase 6
│               ├── social/       # Phase 7
│               ├── admin/        # Phase 8
│               └── notification/ # Phase 7+
├── packages/
│   ├── shared-types/   # DTOs, enums, API response types
│   ├── ui/             # Reusable component library
│   └── config/         # ESLint, TSConfig, Tailwind presets
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts         # (Phase 1+)
└── docker-compose.yml
```

---

## 4. API Conventions

- **Base URL**: `/api/v1/`
- **Auth**: `Authorization: Bearer <access_token>` header
- **Response envelope**:
  ```json
  { "success": true, "data": {...} }
  { "success": false, "error": { "code": "USER_NOT_FOUND", "message": "..." } }
  ```
- **Pagination**: `?page=1&limit=20` → `{ data: [...], total, page, limit, totalPages }`
- **Versioning**: URI-based (`/api/v1/`, `/api/v2/`) managed via NestJS versioning

---

## 5. Environment Variables

See `.env.example` for the full list. Required for each phase:

| Phase | New Variables |
|---|---|
| 0 | `DATABASE_URL`, `REDIS_URL` |
| 1 | `JWT_*`, `GOOGLE_CLIENT_*`, `SMTP_*` |
| 2+ | `S3_*` |
| 6 | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `AZURE_SPEECH_*` |
| 8 | `STRIPE_*`, `VNPAY_*` |

---

## 6. Deployment (Recommended)

| Service | Platform |
|---|---|
| Frontend | Vercel (auto-deploy from `main`) |
| Backend | Railway or Render (Dockerfile) |
| Database | Neon (managed Postgres, serverless-friendly) or Supabase |
| Redis | Upstash (serverless Redis) |
| Media | Cloudflare R2 (S3-compatible, egress-free) |
| AI | Anthropic + OpenAI APIs (direct) |

---

## 7. Security Notes

### Auth (Phase 1)

- **Access token**: 15m expiry, stored in Zustand (memory only — never localStorage/sessionStorage).
- **Refresh token**: 7d expiry, `HttpOnly` cookie — not readable by JS. Hashed with argon2 before DB storage.
- **CORS**: `origin: FRONTEND_URL` (explicit, no wildcard). `credentials: true` required for cookie exchange.
- **Cookie config**: `sameSite: 'lax'` (dev, localhost), `sameSite: 'none'` + `secure: true` (prod, cross-origin HTTPS).
- **Token rotation**: each `/auth/refresh` call revokes the old `RefreshToken` record and issues a new one.
- **Logout**: revokes specific `RefreshToken` by ID. `logoutAll()` revokes all tokens for a user.

> [!NOTE]
> **CSRF**: `/auth/refresh` hiện chỉ dựa vào HttpOnly cookie, chưa có CSRF token.
> Chấp nhận được ở quy mô 2 người dùng hiện tại (private app, không public).
> Nếu mở rộng user base trong tương lai, cần bổ sung:
> - Double-submit cookie pattern, hoặc
> - `SameSite=strict` (nhưng sẽ break cross-origin prod setup), hoặc
> - Custom `X-CSRF-Token` header + server-side validation.

- **Google OAuth**: Phase 2. `OAuthAccount` model đã có sẵn trong schema.
- **Password hashing**: argon2id (argon2 package), 12 iterations — stronger than bcrypt.
- **Rate limiting**: ThrottlerModule — 10 req/s, 100 req/min globally. Auth endpoints thêm stricter limit Phase 2.

---

## 8. Animation Priority Backlog

> Ghi chú kế hoạch — KHÔNG code cho đến Phase tương ứng.

| Phase | Feature | Library | Notes |
|---|---|---|---|
| Phase 2 | **Flashcard flip 3D** | Framer Motion | `rotateY: 180deg`, `backfaceVisibility: 'hidden'`, perspective wrapper |
| Phase 2 | **Confetti milestone** | `lottie-react` | JSON animation file hoặc `canvas-confetti` npm package |
| Phase 4 | **Score reveal** | Framer Motion | Số đếm từ 0 → final score với `useMotionValue` + `useTransform` |
| Phase 5 | **Waveform luyện nói** | `lottie-react` | Waveform Lottie JSON đồng bộ với audio playback state |
| Phase 7 | **Couple-mode streak bar** | Framer Motion | Animated bar race so sánh streak/XP giữa 2 users, layout animation |
| Phase 7 | **Couple-mode XP race** | Framer Motion | `AnimatePresence` + `layoutId` để transition khi thứ tự đổi |
| Phase 7 | **Notification badge pulse** | Framer Motion | `scale` + `opacity` keyframes khi có notification mới |

---

## 9. Quyết Định Chiến Lược (Strategic Decisions & Backlog)

> **Cập nhật ngày 08/09/2026 — Lựa chọn B (Nội dung & Ổn định tối đa):**
> 1. **Tạm hoãn AI LLM/STT thương mại (OpenAI, Anthropic, Azure Speech)**: Ứng dụng hiện tại phục vụ 2 người dùng cá nhân luyện thi thực tế. Đánh giá Speaking/Writing tiếp tục duy trì bộ công thức Heuristic nội bộ (đếm từ, WPM, rubric tiêu chuẩn) minh bạch với người dùng. AI thật tốn phí theo lượt gọi sẽ chỉ được kích hoạt sau khi hệ thống nội dung cốt lõi và bài luyện thi hoàn thiện đầy đủ.
> 2. **Tạm hoãn tích hợp Payment Gateway thật (VNPay, Stripe)**: Hệ thống duy trì cơ chế kích hoạt VIP Premium Demo miễn phí, không phát sinh giao dịch tiền tệ thật.
> 3. **Ưu tiên số 1**: Quy mô nội dung thực tế (10+ chủ đề từ vựng 150-200 từ, 10+ chủ điểm ngữ pháp, 3+ mini tests và Part 1-7 đầy đủ), thuật toán SM-2, hệ thống quản trị Admin CMS mở rộng (Vocabulary, Grammar, Tests), và trải nghiệm người dùng hoàn thiện, mượt mà trên cả desktop lẫn mobile.


