# Guestbook

## Description

- Simple Guestbook app consisting of a HTML / JS client and Hono / Postgres backend
- HTML / TS Frontend (`/frontend`) which is built and compiled with `parcel` for dev and prod
- Hono backend (`/backend`) which is compiled with `tsx` in dev and `esbuild` for prod
- Postgres DB for persisting messages
- The hono backend server serves the compiled frontend static files from `/dist/frontend/`

## Local Development Workflow

- Node 20
- `corepack enable` (pnpm)
- `pnpm i`
- `pnpm run:dev` - this will watch and compile `/dist/{backend,frontend}/`
- `http://localhost:3000/`

## Local Production Workflow

- Node 20
- `corepack enable` (pnpm)
- `pnpm i --frozen-lockfile`
- `pnpm run build` - will output compiled files to `/dist/{backend,frontend}`
- `pnpm run start` - will run `node /dist/backend/index.ts`
- `http://localhost:3000/`

## Docker Compose

### Local

- Call `./scripts/create-secrets.sh <DB_USER> <DB_PASSWORD> <DB_NAME>` to create runtime Docker `guestbook/secrets` dir that compose file relies on ([Docker Compose Secrets](https://docs.docker.com/compose/how-tos/use-secrets/))
- from root, run `docker compose -f guestbook/compose.yaml up` (add `--build` to rebuild images)
- this will spin up the `guestbook` service and `postgres` backend
- `http://localhost:3000/`
- SELECT: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "SELECT * FROM messages;"`
- DELETE: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "DELETE FROM messages;"`
- Currently not added a volume (either bind mount or named volume) so will need to dev and build locally and rebuild images

### Production

- tbc

## Build and Push Images

- tbc
