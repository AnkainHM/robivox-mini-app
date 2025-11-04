FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

COPY .env ./

RUN yarn build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

EXPOSE 5893

CMD ["serve", "-s", "dist", "-l", "5893"]

