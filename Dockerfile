# Этап 1: Общие зависимости и build для бэкенда (backend)
FROM node:20 AS builder

WORKDIR /app

# Копируем ТОЛЬКО package.json и package-lock.json для кэширования
COPY package.json package-lock.json ./

# Устанавливаем основные зависимости
RUN npm install
RUN npm audit fix

# Копируем остальные файлы бэкенда
COPY ./backend .

# Этап 2: Подготовка к запуску бэкенда (backend)
FROM node:20 AS backend

WORKDIR /app/backend

# Копируем собранные файлы с этапа builder
COPY --from=builder /app /app/backend

EXPOSE 3001
CMD ["sh", "-c", "sleep 10 && npm run db:init && npm run m:run && npm run start"]

# Этап 3: Подготовка к запуску фронтенда (frontend)
FROM node:20 AS frontend

WORKDIR /app/frontend

# Копируем ТОЛЬКО package.json и package-lock.json для кэширования
COPY package.json package-lock.json ./

# Устанавливаем основные зависимости
RUN npm install

# Копируем остальные файлы фронтенда
COPY ./frontend .

EXPOSE 3000
CMD ["npm", "run", "serve"]