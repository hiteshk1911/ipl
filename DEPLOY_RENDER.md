# Deploy backend on Render

This document explains how to deploy the IPL Analytics FastAPI backend on [Render](https://render.com). It covers both **Blueprint** (one-click from repo) and **manual** setup (e.g. if you are a contributor and deploy from a fork).

## Prerequisites

- Backend code in a Git repo (GitHub / GitLab / Bitbucket), including:
  - `render.yaml` (this project root)
  - `requirements.txt`
  - `src/` (API code)
- A [Render](https://render.com) account.

---

## Option A: Deploy with Blueprint (repo owner)

If you **own** the repo or have admin access so Render can see it:

1. Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**.
2. Connect the repository that contains this project.
3. If the repo root is **this folder** (ipl), leave **Root Directory** blank.  
   If the repo root is **above** this folder, set **Root Directory** to `ipl`.
4. Click **Apply**. Render creates:
   - **PostgreSQL**: `ipl-analytics-db` (database: `ipl_analytics`)
   - **Web Service**: `ipl-analytics-api` (Python)
5. Wait for the first deploy to finish. Your API URL: `https://ipl-analytics-api.onrender.com` (or your service name).

Then go to [Apply database schema](#apply-database-schema) and [Verify](#verify-the-api).

---

## Option B: Deploy from a fork (contributors)

If you **don’t see the repo** when adding a Blueprint (e.g. you’re a contributor, not owner):

1. **Fork** the repo to your own GitHub/GitLab account.
2. Push your branch (with `render.yaml`, `requirements.txt`, `src/`) to your fork.
3. In Render: **New** → **Blueprint** → connect **your fork**.
4. Set **Root Directory** to `ipl` if your fork’s root is above this project; otherwise leave blank.
5. Click **Apply** and wait for the deploy.

You’ll get your own Web Service and Postgres. Then follow [Apply database schema](#apply-database-schema) and [Verify](#verify-the-api).

---

## Option C: Manual deploy (no Blueprint)

Create the services by hand in the Render dashboard (useful if you can’t or don’t want to use a Blueprint).

### 1. Create PostgreSQL

1. **New** → **PostgreSQL**.
2. Name: `ipl-analytics-db` (or any name).
3. Database: `ipl_analytics`, User: e.g. `ipl_analytics`, Region: **Oregon**, Plan: **Free**.
4. Create. Copy **Internal Database URL** and/or **Hostname**, **Port**, **Database**, **Username**, **Password**.

### 2. Create Web Service

1. **New** → **Web Service**.
2. Connect the repo (or your fork). Set **Root Directory** to `ipl` if the repo root is above this project.
3. Configure:
   - **Name:** `ipl-analytics-api`
   - **Region:** Oregon
   - **Runtime:** Python
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `python -m ipl_analytics.api.run`
   - **Health check path:** `/api/v1/health`
4. **Environment** – add:
   - `PYTHONPATH` = `src`
   - `DB_HOST` = (Postgres hostname from step 1)
   - `DB_PORT` = (Postgres port, usually `5432`)
   - `DB_USER` = (Postgres username)
   - `DB_PASSWORD` = (Postgres password)
   - `DB_NAME` = `ipl_analytics`
5. Create. Wait for the first deploy.

---

## Apply database schema

Render Postgres starts **empty**. Run the project schema once.

From this project root (directory that contains `src/`):

```bash
psql "<Internal Database URL>" -f src/ipl_analytics/sql/schema.sql
```

If you use analytics views:

```bash
psql "<Internal Database URL>" -f src/ipl_analytics/sql/analytics.sql
```

Replace `<Internal Database URL>` with the full URL from the Render Postgres service (e.g. `postgresql://user:password@host:5432/ipl_analytics`). Or use a GUI (pgAdmin, DBeaver, etc.) with the same host, port, database, user, password.

---

## Load data (optional)

To populate matches/players/deliveries, run your ingestion scripts against the Render DB. Set:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

to the values from the Render Postgres service, then run e.g.:

```bash
PYTHONPATH=src poetry run python -m ipl_analytics.ingestion.ingest_season ...
```

(Use your usual ingestion command and env.)

---

## Verify the API

- **Root:** `https://<your-service-name>.onrender.com/`
- **Health:** `https://<your-service-name>.onrender.com/api/v1/health`
- **Docs:** `https://<your-service-name>.onrender.com/docs`

Health should return `{"status":"healthy","database":"connected",...}`. If `database` is not `connected`, check env vars and that the schema was applied.

---

## Frontend (production)

Point the frontend at the deployed backend:

- `EXPO_PUBLIC_API_URL=https://<your-service-name>.onrender.com`
- Optional: `EXPO_PUBLIC_ENV=production`

Rebuild or run the frontend so it uses this URL.

---

## Reference

| Item           | Value |
|----------------|-------|
| Build command  | `pip install -r requirements.txt` |
| Start command  | `python -m ipl_analytics.api.run` |
| Health path    | `/api/v1/health` |
| Root Directory | `ipl` if repo root is above this project; else blank |
| Config file    | `render.yaml` (Blueprint) |

**Troubleshooting:** Build/deploy logs are in the Render dashboard. Ensure `PYTHONPATH=src` is set. On the free plan, the service may sleep after inactivity (slow first request after idle).
