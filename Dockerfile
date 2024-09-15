FROM public.ecr.aws/docker/library/node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json ./

# RUN \
# 	if [ -f package-lock.json ]; then \
# 		npm ci; \
# 	else \
# 		npm install --legacy-peer-deps; \
# 	fi

RUN npm install --legacy-peer-deps

COPY . .

# Environment variables must be present at build time
ARG CRON_JOB_SECRET
ENV CRON_JOB_SECRET=$CRON_JOB_SECRET
ARG DISCORD_CLIENT_ID
ENV DISCORD_CLIENT_ID=$DISCORD_CLIENT_ID
ARG DISCORD_CLIENT_SECRET
ENV DISCORD_CLIENT_SECRET=$DISCORD_CLIENT_SECRET
ARG DISCORD_REDIRECT_URI
ENV DISCORD_REDIRECT_URI=$DISCORD_REDIRECT_URI
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ARG JWT_ISSUER
ENV JWT_ISSUER=$JWT_ISSUER
ARG JWT_SECRET
ENV JWT_SECRET=$JWT_SECRET
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT
ENV NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT=$NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT
ARG NEXT_PUBLIC_CACHET_API_URL
ENV NEXT_PUBLIC_CACHET_API_URL=$NEXT_PUBLIC_CACHET_API_URL
ARG NEXT_PUBLIC_ONESIGNAL_APP_ID
ENV NEXT_PUBLIC_ONESIGNAL_APP_ID=$NEXT_PUBLIC_ONESIGNAL_APP_ID
ARG NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID
ENV NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID=$NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID
ARG NEXT_PUBLIC_WEBSOCKET_URL
ENV NEXT_PUBLIC_WEBSOCKET_URL=$NEXT_PUBLIC_WEBSOCKET_URL
ARG NODE_NO_WARNINGS
ENV NODE_NO_WARNINGS=$NODE_NO_WARNINGS
ARG NX_DAEMON
ENV NX_DAEMON=$NX_DAEMON
ARG REDIS_URL
ENV REDIS_URL=$REDIS_URL
ARG SENDGRID_API_KEY
ENV SENDGRID_API_KEY=$SENDGRID_API_KEY
ARG SENDGRID_FROM_EMAIL
ENV SENDGRID_FROM_EMAIL=$SENDGRID_FROM_EMAIL
ARG SENDGRID_PASSWORD_TEMPLATE_ID
ENV SENDGRID_PASSWORD_TEMPLATE_ID=$SENDGRID_PASSWORD_TEMPLATE_ID
ARG SENDGRID_TEMPLATE_ID
ENV SENDGRID_TEMPLATE_ID=$SENDGRID_TEMPLATE_ID
ARG SERVER_API_ADMIN_KEY
ENV SERVER_API_ADMIN_KEY=$SERVER_API_ADMIN_KEY
ARG SERVER_API_URL
ENV SERVER_API_URL=$SERVER_API_URL


# Build the app
RUN npm run build

# Production image
FROM builder as production

RUN apk --no-cache add curl

WORKDIR /app

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# USER nextjs

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV PORT 3000

CMD HOSTNAME=0.0.0.0 npm run start