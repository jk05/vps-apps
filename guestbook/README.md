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
- from root, run:
  - Production - `docker compose -f guestbook/compose.yaml up --no-build`
  - local - `docker compose -f guestbook/compose.yaml up --build`
- this will spin up the `guestbook` service and `postgres` backend
  - Production: [jknr.io:3000](http://jknr.io:3000/) (TODO: TLS/HTTPS)
  - local - `http://localhost:3000/`
- SELECT: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "SELECT * FROM messages;"`
- DELETE: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "DELETE FROM messages;"`
- Local: Currently not added a volume (either bind mount or named volume) so will need to dev and build locally and rebuild images

### Build and Push Images

#### Build Images

NOTE: Keep in mind [https://github.com/rancher-sandbox/rancher-desktop/issues/5755](https://github.com/rancher-sandbox/rancher-desktop/issues/5755) as can try again after Mac OS bump to >= 15. Also this can all be resolved by using GH Workflows and building in GH hosted default Linux runners so should be the optimal step to try next...

- Things are a little messy here locally given Rancher Desktop `docker` and Mac M3 chip currently
  - Building on the M Chips (`linux/arm64`) will not work on Linux kernels (VPS)
  - [https://docs.docker.com/build/building/multi-platform/](https://docs.docker.com/build/building/multi-platform/) - can normally follow this and should work
  - was having some issues with Rancher Desktop settings for `docker`
- I did the following for now to get it working:
  - `docker run --rm --privileged tonistiigi/binfmt --install all` ([link](https://docs.docker.com/build/building/multi-platform/#install-qemu-manually))
  - Then did the following to create a custom builder ([link - see 'Custom Builder'](https://docs.docker.com/build/building/multi-platform/#prerequisites)):

    ```shell
    docker buildx create \
    --name container-builder \
    --driver docker-container \
    --bootstrap --use
    ```

    - Now we want to use `buildx` binary to build multi-platform builds using `--platform`. Also the `docker-container` set in creating the custom builder means you need to explictly `--load` or `--push` the build:

    ```shell
    docker buildx build --platform linux/amd64,linux/arm64 \
    -t ghcr.io/jk05/vps-apps-guestbook:{X.X.X} \
    -t ghcr.io/jk05/vps-apps-guestbook:latest \
    -f guestbook/Dockerfile . --push`
    ```

  - N.B. replace `X.X.X` with correct version bump and `--progress=plain` is optional and outputs more detailed build output for debugging etc.
- You should now see `OS / Arch` for your container images - [https://github.com/jk05/vps-apps/pkgs/container/vps-apps-guestbook](https://github.com/jk05/vps-apps/pkgs/container/vps-apps-guestbook)
- Note: the `uknown/unknown` for one of the images - [GH Community Discussion](https://github.com/orgs/community/discussions/45969)

#### Push Images

- `docker push ghcr.io/jk05/vps-apps-guestbook:latest` (in a normal scenario where I don't the above - but that covers the `--push` too...)
