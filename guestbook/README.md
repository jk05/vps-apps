# Guestbook

## Description

- Simple Guestbook app consisting of a HTML / JS client and Hono / Postgres backend
- HTML / TS Frontend (`/frontend`) which is built and compiled with `parcel` for dev and prod
- Hono backend (`/backend`) which is compiled with `tsx` in dev and `esbuild` for prod
- Postgres DB for persisting messages
- The hono backend server serves the compiled frontend static files from `/dist/frontend/`

## Local Workflows

### Local Development Build Workflow

- Node 20
- `corepack enable` (pnpm)
- `pnpm i`
- `pnpm run:dev` - this will watch and compile `/dist/{backend,frontend}/`
- `http://localhost:3000/`

### Local Production Build Workflow

- Node 20
- `corepack enable` (pnpm)
- `pnpm i --frozen-lockfile`
- `pnpm run build` - will output compiled files to `/dist/{backend,frontend}`
- `pnpm run start` - will run `node /dist/backend/index.ts`
- `http://localhost:3000/`

## Docker Compose

### Log in to ghcr

- Before anything, you need to be logged in to `ghcr` (locally or VPS) with a Github PAT that has `{read,write,delete}:packages` scopes
- `export GHCR_PAT={PAT}`
- `echo $GHCR_PAT | docker login ghcr.io -u <your-github-username> --password-stdin`

### Compose Up

- Call `./scripts/create-secrets.sh <DB_USER> <DB_PASSWORD> <DB_NAME>` to create runtime Docker `guestbook/secrets` dir that Docker Compose secrets relies on ([Docker Compose Secrets](https://docs.docker.com/compose/how-tos/use-secrets/))
- make sure you gave a relevant Github token in order to pull the images and logged in (i.e. `echo $GITHUB_TOKEN | docker login ghcr.io -u <your-github-username> --password-stdin`)
- from root, run `docker compose -f guestbook/compose.yaml up --no-build` (local - `docker compose -f guestbook/compose.yaml up --build`)
- this will spin up the `guestbook` service and `postgres` backend (local - `http://localhost:3000/`)
- SELECT: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "SELECT * FROM messages;"`
- DELETE: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "DELETE FROM messages;"`
- Local: Currently not added a volume (either bind mount or named volume) so will need to dev and build locally and rebuild images

### Build and Push Images

#### Build Images

- `docker build -t ghcr.io/jk05/vps-apps-guestbook:{X.X.X} -t ghcr.io/jk05/vps-apps-guestbook:latest -f guestbook/Dockerfile . --progress=plain`
- N.B. replace `X.X.X` with correct version bump and `--progress=plain` is optional and outputs more detailed build output for debugging etc.

#### Push Images

- `docker push ghcr.io/jk05/vps-apps-guestbook:latest`
