# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install required build tools (can fix some alpine build bug)
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Production runtime ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

# Next.js stores build output in .next/standalone for minimal runtime size
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R nodeuser:nodejs /app

USER nodeuser

# Expose the default Next.js port
EXPOSE 3000

CMD ["node", "server.js"]
