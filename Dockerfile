# Multi-stage build para optimizar el tamaño final
FROM node:18-alpine AS base

# Instalar dependencias solo cuando sea necesario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar Prisma client con binaryTargets correctos
RUN npx prisma generate

# Build de la aplicación
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Copiar Prisma client generado
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar package.json para scripts
COPY --from=builder /app/package.json ./package.json

# Crear usuario nextjs
RUN addgroup -g 1001 nodejs
RUN adduser -D -s /bin/sh -u 1001 -G nodejs nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Comando de inicio que configura todo automáticamente (como root)
CMD ["sh", "-c", "npx prisma generate && npx prisma db push && npx prisma db seed && chown -R nextjs:nextjs /app/node_modules/.prisma && su nextjs -c 'node server.js'"]
