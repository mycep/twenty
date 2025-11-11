# Base image for common dependencies
FROM node:24-alpine AS common-deps

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./.prettierrc /app/
COPY ./packages/twenty-emails/package.json /app/packages/twenty-emails/
COPY ./packages/twenty-server/package.json /app/packages/twenty-server/
COPY ./packages/twenty-server/patches /app/packages/twenty-server/patches
COPY ./packages/twenty-ui/package.json /app/packages/twenty-ui/
COPY ./packages/twenty-shared/package.json /app/packages/twenty-shared/
COPY ./packages/twenty-front/package.json /app/packages/twenty-front/

# Install all dependencies
RUN yarn && yarn cache clean && npx nx reset


# Build the back
FROM common-deps AS twenty-server-build

# Copy sourcecode after installing dependences to accelerate subsequents builds
COPY ./packages/twenty-emails /app/packages/twenty-emails
COPY ./packages/twenty-shared /app/packages/twenty-shared
COPY ./packages/twenty-server /app/packages/twenty-server

# Disable file watching during build (not needed in Docker, prevents ENOSPC errors)
ENV CHOKIDAR_USEPOLLING=false
ENV WATCHPACK_POLLING=false
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Build the server
RUN npx nx run twenty-server:build

RUN yarn workspaces focus --production twenty-emails twenty-shared twenty-server

# Build the front
FROM common-deps AS twenty-front-build

ARG REACT_APP_SERVER_BASE_URL

# Ensure the var is available to the Vite build
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

COPY ./packages/twenty-front /app/packages/twenty-front
COPY ./packages/twenty-ui /app/packages/twenty-ui
COPY ./packages/twenty-shared /app/packages/twenty-shared
# Increase memory and reduce checks for Vite build in CI/Docker
ENV NODE_OPTIONS="--max-old-space-size=8192"
ENV VITE_DISABLE_TYPESCRIPT_CHECKER=true
ENV VITE_DISABLE_ESLINT_CHECKER=true
ENV VITE_SOURCEMAP=false
ENV VITE_LOG_LEVEL=debug
ENV CI=false
# Patch Vite config for Rollup v4: remove deprecated chunkSizeWarningLimit if present
RUN set -e; \
  if [ -f /app/packages/twenty-front/vite.config.ts ]; then \
    sed -i '/chunkSizeWarningLimit/d' /app/packages/twenty-front/vite.config.ts; \
  fi
# Build with verbose logs; disable minify and sourcemaps to reduce memory usage
RUN npx nx build twenty-front --skip-nx-cache --verbose -- --minify=false --sourcemap=false


# Final stage: Run the application
FROM node:24-alpine AS twenty

# Used to run healthcheck in docker
RUN apk add --no-cache curl jq

RUN npm install -g tsx

RUN apk add --no-cache postgresql-client

COPY ./packages/twenty-docker/twenty/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app/packages/twenty-server

ARG REACT_APP_SERVER_BASE_URL
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

# Copy built applications from previous stages
COPY --chown=1000 --from=twenty-server-build /app /app
COPY --chown=1000 --from=twenty-server-build /app/packages/twenty-server /app/packages/twenty-server
COPY --chown=1000 --from=twenty-front-build /app/packages/twenty-front/build /app/packages/twenty-server/dist/front

# Set metadata and labels
LABEL org.opencontainers.image.source=https://github.com/twentyhq/twenty
LABEL org.opencontainers.image.description="This image provides a consistent and reproducible environment for the backend and frontend, ensuring it deploys faster and runs the same way regardless of the deployment environment."

RUN mkdir -p /app/.local-storage /app/packages/twenty-server/.local-storage && \
    chown -R 1000:1000 /app

# Use non root user with uid 1000
USER 1000

CMD ["node", "dist/src/main"]
ENTRYPOINT ["/app/entrypoint.sh"]
