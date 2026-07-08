# WOCCO Platform — Frontend

Next.js dashboard for the WOCCO sales lead platform.

Backend API lives in the private [wocco-platform](https://github.com/wocco-sales/wocco-platform) monorepo.

## Local development

```bash
npm install
cp .env.production.example .env.local
# Edit .env.local — point NEXT_PUBLIC_API_URL at your local API (default http://localhost:3000)

npm run dev
# http://localhost:3001
```

## Deploy on Vercel

1. Import this repo on [vercel.com/new](https://vercel.com/new)
2. Framework: **Next.js** (auto-detected)
3. Add environment variable:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.yourdomain.com` |

4. Deploy

After deploy, add your Vercel URL to `CORS_ORIGINS` in the backend `.env.production` and restart PM2.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL (no trailing slash) |

See `.env.production.example` for a template.
