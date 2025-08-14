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
- `pnpm run build`
  - will output compiled files to `/dist/{backend,frontend}`
- `pnpm run start`
  - will run `node /dist/backend/index.ts`
- `http://localhost:3000/`

## Docker Compose

### Log in to ghcr

- Before anything, you need to be logged in to `ghcr` (locally or VPS) with a Github PAT that has `{read,write,delete}:packages` scopes
  - `export GHCR_PAT={PAT}`
  - `echo $GHCR_PAT | docker login ghcr.io -u <your-github-username> --password-stdin`

### Compose Up via Makefile (Locally and on the VPS)

- Call `./scripts/create-secrets.sh <DB_USER> <DB_PASSWORD> <DB_NAME>` to create runtime Docker `guestbook/secrets` dir that Docker Compose secrets relies on ([Docker Compose Secrets](https://docs.docker.com/compose/how-tos/use-secrets/))
- make sure you gave a relevant Github token in order to pull the images and logged in (i.e. `echo $GITHUB_TOKEN | docker login ghcr.io -u <your-github-username> --password-stdin`)
- from root, run:
  - Build image locally and use - `make dev-guestbook-up`
  - Use latest image in GHCR (VPS) - `make prod-guestbook-up`
- this will spin up the `guestbook` service and `postgres` backend behind `Traefik` proxying
  - Production: [jknr.io/guestbook](http://jknr.io/guestbook) (TODO: TLS/HTTPS)
  - local - `http://localhost:8081/guestbook`
- SELECT: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "SELECT * FROM messages;"`
- DELETE: `docker exec -it guestbook-postgres-1 psql -U {USER} -d {DB} -c "DELETE FROM messages;"`

- NOTE FOR DEV: Currently the Compose is NOT setup for any development workflow i.e. no volume (either bind mount or named volume) or dynamic rebuilds so will need to dev and build locally and rebuild images for now...

### Build and Push Images

#### Build Images

NOTE: Keep in mind [https://github.com/rancher-sandbox/rancher-desktop/issues/5755](https://github.com/rancher-sandbox/rancher-desktop/issues/5755) as can try again after Mac OS bump to >= 15. Also this can all be resolved by using GH Workflows and building in GH hosted default Linux runners so should be the optimal step to try next...

- Things are a little messy here locally given Rancher Desktop `docker` and Mac M3 chip currently
  - Building on the M Chips (`linux/arm64`) will not work on Linux kernels (VPS)
  - [https://docs.docker.com/build/building/multi-platform/](https://docs.docker.com/build/building/multi-platform/) - can normally follow this and should work
  - was having some issues with Rancher Desktop settings for `docker`
- I did the following for now to get it working:

  - `docker run --rm --privileged tonistiigi/binfmt --install all` ([link - install qemu](https://docs.docker.com/build/building/multi-platform/#install-qemu-manually))
    - August 2025: some issues so had to make sure I used `v7.0.0`
      - `docker run --privileged --rm tonistiigi/binfmt:qemu-v7.0.0 --install all`
      - <https://slack-archive.rancher.com/t/29099309/it-seems-as-tho-rancher-desktop-1-19-has-introduced-some-wei>
  - Then did the following to create a custom builder ([link - see 'Custom Builder'](https://docs.docker.com/build/building/multi-platform/#prerequisites)):

    ```shell
    docker buildx create \
    --name container-builder \
    --driver docker-container \
    --bootstrap --use
    ```

  - Make sure this custom builder is either set (`docker buildx ls` and then `docker buildx use container-builder` or you can set inline in the next build command...)
  - Now we want to use `buildx` binary to build multi-platform builds using `--platform`. Also the `docker-container` set in creating the custom builder means you need to explictly `--load` or `--push` the build:

  ```shell
  docker buildx build \
  --builder container-builder \
  --platform linux/amd64,linux/arm64 \
  --progress=plain \
  -t ghcr.io/jk05/vps-apps-guestbook:1.0.2 \
  -t ghcr.io/jk05/vps-apps-guestbook:latest \
  -f guestbook/Dockerfile . \
  --push
  ```

  - N.B. replace `X.X.X` with correct version bump and `--progress=plain` is optional and outputs more detailed build output for debugging etc.

- You should now see `OS / Arch` for your container images - [https://github.com/jk05/vps-apps/pkgs/container/vps-apps-guestbook](https://github.com/jk05/vps-apps/pkgs/container/vps-apps-guestbook)
- Note: the `uknown/unknown` for one of the images - [GH Community Discussion](https://github.com/orgs/community/discussions/45969)

##### Troubleshoot

- <https://slack-archive.rancher.com/t/29099309/it-seems-as-tho-rancher-desktop-1-19-has-introduced-some-wei>
  - you may hit amd64 Go binary issues so may need to reinstall `tonistiigi/binfmt` or unintsall / reinstall `amd64` emulator
- If secrets are not updating, you may need to wipe the Docker volumes first
  - `docker volume ls`
  - `docker volume rm <volume_name>`

#### Push Images

- `docker push ghcr.io/jk05/vps-apps-guestbook:latest` (in a normal scenario where I don't the above - but is covered by the `buildx` `--push` command...)

#### Additional

- <https://maximorlov.com/4-essential-steps-to-securing-a-vps/#4-enable-automatic-security-updates>
  - enabled automatic security updates
- VPS is minimal and doesn't have `htop`, `top`
  - use `free -h` or `docker stats` for now
- Limits / TODOs

  - Github workflow - building images (local emulation is PITA)
  - Dockerfile cleanup - pnpm workspaces for deploy etc.
  - Build cleanup
  - Needs to be rearranged for further monorepo usage in future
  - no replicas for now

    - if needed, simply add the following to the `guestbook` service in the `compose.yaml`:

      ```bash
      deploy:
        mode: replcated
        replicas: {number}
      ```
