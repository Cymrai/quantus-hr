# Quantus HR

> Smart HR & Employee Performance Management Platform

## Quick Start

```bash
# 1. Clone and install
pnpm install

# 2. Copy env
cp .env.example .env

# 3. Start infrastructure
docker compose up -d

# 4. Run migrations
pnpm db:migrate

# 5. Start dev servers
pnpm dev
```

## Apps
| App | URL | Description |
|-----|-----|-------------|
| `apps/api` | http://localhost:3001/api | NestJS REST API |
| `apps/web` | http://localhost:3000 | Next.js dashboard |
| API Docs | http://localhost:3001/api/docs | Swagger UI |
| Mail UI | http://localhost:8025 | MailHog |

## Stack
- **API**: NestJS · TypeORM · PostgreSQL + pgvector · Redis · BullMQ
- **Web**: Next.js 15 · Tailwind CSS · React Query · Zustand
- **AI**: Anthropic Claude (primary) · OpenAI GPT-4o (fallback)
- **Infra**: Docker Compose · GitHub Actions · AWS ECS (prod)

## Development

```bash
pnpm dev          # all apps
pnpm build        # production build
pnpm test         # run all tests
pnpm lint         # lint everything
```
