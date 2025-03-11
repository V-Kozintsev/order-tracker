FROM node:22.14.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Сборка фронтенда
RUN npm run build

# --- Этап production ---
FROM node:22.14.0-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/backend ./backend

# Установка зависимостей внутри контейнера
COPY package*.json ./
RUN npm install

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
