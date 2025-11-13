## Builder (Get Dependencies)
FROM node:20.18.0-alpine3.20 as builder
# use non-root user for security reasons 
USER node
WORKDIR /home/node

COPY package*.json ./
# TODO: use npm ci
RUN npm i --force 
COPY --chown=node:node . .
# Build and remove dev dependencies
RUN npm run build \
    && npm prune --omit=dev



## Create Production Image
FROM node:20.18.0-alpine3.20
# openssl upgrade
RUN apk upgrade --update-cache --available && \
    apk upgrade openssl && \
    rm -rf /var/cache/apk/*

USER node
WORKDIR /home/node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

# TODO set node env to production
# ENV DB_HOST="value from secret manager" \
#     DB_NAME="value from secret manager" \
#     DB_USER="value from secret manager" \
#     DB_PASSWORD="value from secret manager" \
#     PORT="value from secret manager" \
#     JWT_SECRET_KEY="value from secret manager" \
#     JWT_EXPIRATION_TIME="value from secret manager" \
#     SENDGRID_API_KEY="value from secret manager" \
#     FROM_EMAIL="value from secret manager" \
#     BASE_URL="value from secret manager" \
#     DOCTOR_INVITE_URL="value from secret manager" \
#     AWS_ACCESS_KEY="value from secret manager" \
#     AWS_SECRET_KEY="value from secret manager" \
#     AWS_S3_BUCKET_NAME="value from secret manager" \
#     JWT_RESET_PASSWORD_EXPIRATION="value from secret manager" \
#     FROM_NAME="value from secret manager" \
#     REDIS_CACHE_EXPIRE="value from secret manager" \
#     REDIS_HOST="value from secret manager" \
#     REDIS_PORT="value from secret manager" \
#     REDIS_PREFIX_WEBAPP_SESSIONS="value from secret manager" \
#     STRIPE_STAGING_SECRET_KEY="value from secret manager" \
#     REMEDI_PAYMENT_ENCRYPTIONKEY="value from secret manager" \
#     INVITE_LINK_SECRET_KEY="value from secret manager" \
#     CLINIC_INVITE_URL="value from secret manager" \

# RUN env

EXPOSE 4001

CMD ["node", "dist/main.js"]