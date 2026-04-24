# GrowPath MVP (YC Demo Day Prototype)

GrowPath is an AI-powered student productivity platform where one living plant reflects a student's effort over the semester.

## Stack
- `apps/web`: React + Vite + TypeScript + Tailwind CSS
- `apps/api`: Node.js + Express + TypeScript
- `packages/shared`: shared TypeScript contracts
- `prisma`: PostgreSQL schema + seed script

## What this MVP includes
- Landing page with cozy, emotionally resonant framing.
- Onboarding flow for student profile, courses, assignments, study preferences, break days, and plant naming.
- Dashboard with:
  - Animated SVG plant (5 growth levels)
  - XP bar + level progression
  - Streak tracking
  - Upcoming deadlines
  - Weekly AI-generated plan
  - Focus timer with abandon behavior + tab-switch sadness state
- XP system:
  - Session XP based on minutes
  - Assignment XP based on difficulty
  - Streak mood transitions (blooming)
  - Wilt/sad states supported by plant state endpoints
- API routes for users, courses, assignments, study sessions, plant state, and plans.
- AI scheduler abstraction with realistic mock fallback when `ANTHROPIC_API_KEY` is missing.

## Quick start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
3. (Optional) Set up database for Prisma-backed persistence:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```
4. Run web + API together:
   ```bash
   npm run dev
   ```

- Web app: http://localhost:5173
- API: http://localhost:4000

## API highlights
- `POST /api/plans/generate`: day-by-day study plan generation
- `POST /api/study-sessions`: complete or abandon focus sessions
- `POST /api/assignments/:id/complete`: mark assignment complete + award XP
- `GET /api/plant/:userId`: computed plant progression (level/theme/mood)

## Notes for auth
MVP uses mock user handling (`demo-user`) and route shapes that can be wrapped by Clerk/Auth0 middleware later without changing core domain logic.
