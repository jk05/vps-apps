# Stage 1: Build stage
FROM node:20-alpine AS build

LABEL org.opencontainers.image.source="https://github.com/jk05/vps-apps"
LABEL org.opencontainers.image.revision=$COMMIT_SHA
LABEL org.opencontainers.image.title="Guestbook"
LABEL org.opencontainers.image.description="A guestbook application using Hono and PostgreSQL"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.authors="Jas K"

# Set the working directory
WORKDIR /app/guestbook

# Install dependencies and build the app
COPY guestbook/package.json guestbook/pnpm-lock.yaml ./

# Enable Corepack for pnpm
RUN corepack enable

# Use build argument NODE_ENV (defaults to production if not set)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Install all dependencies (dev and prod) - since Parcel is devDep
RUN pnpm install --frozen-lockfile --prod=false

COPY guestbook ./

# Build the app (frontend and backend)
RUN pnpm build

RUN pnpm prune --prod

# Stage 2: Production stage
FROM node:20-alpine AS production

# Set the working directory
WORKDIR /app

# Copy only the built files and node_modules from the build stage
COPY --chown=node:node --from=build /app/guestbook/dist ./dist
COPY --chown=node:node --from=build /app/guestbook/node_modules ./node_modules
COPY --chown=node:node --from=build /app/guestbook/package.json ./package.json
COPY --chown=node:node --from=build /app/guestbook/scripts ./scripts

# Switch to non-root user
USER node

# Expose the port
EXPOSE 3000

# Get runtime env vars for Guestbook app from Docker secret files
ENTRYPOINT ["scripts/entrypoint.sh"]

# Start the application
CMD ["node", "dist/backend/index.js"]