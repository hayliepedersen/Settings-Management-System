.PHONY: help install up down restart logs logs-frontend logs-backend clean status
.PHONY: dev-frontend dev-backend format format-check lint lint-fix type-check dev-db stop-db

help:
	@echo "Available commands:"
	@echo "  make install          - Install all dependencies"
	@echo "  make up              - Start Docker containers"
	@echo "  make down            - Stop Docker containers"
	@echo "  make logs            - View all logs"
	@echo "  make clean           - Remove containers and volumes"
	@echo ""
	@echo "  make dev-frontend    - Run frontend dev server"
	@echo "  make dev-backend     - Run backend dev server"
	@echo "  make dev-db          - Start postgres for local dev"
	@echo ""
	@echo "  make format          - Format all code"
	@echo "  make lint            - Lint all code"

install:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Creating backend virtual environment..."
	cd backend && python3 -m venv venv
	@echo "Installing backend dependencies..."
	cd backend && ./venv/bin/pip install -r requirements.txt
	@echo "Done!"

up:
	docker compose up -d --build

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d --build

logs:
	docker compose logs -f

logs-frontend:
	docker compose logs -f frontend

logs-backend:
	docker compose logs -f backend

clean:
	docker compose down -v

status:
	docker compose ps

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && ./venv/bin/uvicorn app.main:app --reload

dev-db:
	docker run --name settings-db -d \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=settings_db \
		-p 5432:5432 \
		postgres:15-alpine

stop-db:
	docker stop settings-db && docker rm settings-db || true

format:
	@echo "Formatting frontend..."
	cd frontend && npm run format
	@echo "Formatting backend..."
	cd backend && ./venv/bin/black .

format-check:
	@echo "Checking frontend format..."
	cd frontend && npm run format:check
	@echo "Checking backend format..."
	cd backend && ./venv/bin/black . --check

lint:
	@echo "Linting frontend..."
	cd frontend && npm run lint
	@echo "Linting backend..."
	cd backend && ./venv/bin/ruff check

lint-fix:
	@echo "Linting and fixing frontend..."
	cd frontend && npm run lint -- --fix
	@echo "Linting and fixing backend..."
	cd backend && ./venv/bin/ruff check --fix

type-check:
	@echo "Type checking frontend..."
	cd frontend && npm run type-check
	@echo "Type checking backend..."
	cd backend && ./venv/bin/mypy .