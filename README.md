# 1. Настройка переменных окружения

Для корректной работы приложения необходимо настроить переменные окружения. Создайте файл .env в корне вашего проекта и заполните его следующими данными:

# Для локальной разработки:

- PORT=3000
- DB_USER=order_track_user
- DB*PASSWORD=ваш*пароль
- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=order_track

# Для развертывания с использованием Docker:

- PORT=3000
- DB_USER=order_track_user
- DB*PASSWORD=ваш*пароль
- DB_HOST=db
- DB_PORT=5432
- DB_NAME=order_track

git push amvera main

docker-compose up --build

docker-compose down -v

# Подключение к PostgreSQL: Подключитесь к PostgreSQL как суперпользователь (например, postgres).

psql -U postgres

# Создание пользователя:

CREATE ROLE order*track_user WITH LOGIN PASSWORD 'ваш*пароль';

# Создание базы данных:

CREATE DATABASE order_track OWNER order_track_user;

# Предоставление прав пользователю на базу данных:

GRANT ALL PRIVILEGES ON DATABASE order_track TO order_track_user;

# Развертывание с помощью Docker

docker-compose up --build

# Остановка и удаление контейнеров:

docker-compose down -v

5. Работа с Git и Amvera

git add .
git commit -m "Описание изменений"
git push amvera main

npm run db:init (создаем бд)

npm run m:run (накатываем миграции)
