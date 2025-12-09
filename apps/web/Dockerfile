FROM node:22-alpine AS build
WORKDIR /app

# Install build deps
RUN apk add --no-cache python3 make g++ git

# Copy package.json
COPY package.json ./

# Copy the rest of the source code
COPY . .

# Install and build
RUN yarn install --frozen-lockfile
RUN yarn build

# Runtime stage
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production

ENV PORT=3000

ENV NUXT_TELEMETRY_DISABLED=1

# Copy built output
COPY --from=build /app/.output ./.output

COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]