# breadcrumbs

Minimal Fastify + MongoDB backend for receiving browser error reports and breadcrumb events (from `sdk.js`).

## Stack

- Node.js + TypeScript
- Fastify
- MongoDB

## Project Structure

```text
src/
  app.ts
  server.ts
  config/
    database.ts
  modules/
    log/
      log.routes.ts
      log.controller.ts
      log.service.ts
      log.model.ts
  shared/
    errors/
    middlewares/
```

## Requirements

- Node.js 22+ (recommended)
- MongoDB running locally (or via Docker)

## Environment Variables

Copy `.env.example` to `.env` and adjust values if needed.

```bash
PORT=3000
HOST=0.0.0.0
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=breadcrumbs
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start in development mode:

```bash
npm run dev
```

Type-check:

```bash
npm run typecheck
```

Build:

```bash
npm run build
```

## Run MongoDB with Docker

```bash
docker compose up -d
```

This starts MongoDB on `localhost:27017` using the settings in `docker-compose.yml`.

## API

### `POST /api/log`

Receives an error payload with breadcrumb events and stores it in MongoDB (`logs` collection).

Expected body shape:

```json
{
  "error": {
    "message": "string",
    "stack": "string"
  },
  "events": [
    {
      "type": "string",
      "timestamp": 1710000000000,
      "data": {}
    }
  ]
}
```

Success response:

```json
{ "ok": true }
```
