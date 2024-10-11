# Guestbook

## Description

- Simple Guestbook app consisting of:
- HTML / TS Frontend (`/frontend`) which is built and compiled with ParcelJS
- Hono backend (`/backend`) which is compiled with `tsx` in dev and built with `tsc` for prod
- The hono backend server serves the compiled frontend static files from `/dist`

## Development

- Node 20
- `corepack enable` (pnpm)
- `pnpm i`
- `pnpm run:frontend` - this will watch and compile frontend files and output to `/dist/frontend/`
- `pnpm run:backend` - this will watch and compile backend files and output to `/dist/backend/` (to display static files, need to run `pnpm run:frontend` first)
- `http://localhost:3000/`

## Production

- Node 20
- `corepack enable` (pnpm)
- `pnpm i --frozen-lockfile`
- `pnpm run build:frontend` - `/dist/frontend`
- `pnpm run build:backend` - `/dist/backend`
- `pnpm run start` - will run `node /dist/backend/index.ts`
- `http://localhost:3000/`

## Docker Compose

- tbc
- add a Postgres instance and run the backend server with API routes and serving the static frontend files
