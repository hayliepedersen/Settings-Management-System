# Settings Management System

## Setup

1. **Clone the repo:**

```bash
   git clone https://github.com/hayliepedersen/Settings-Management-System.git
   cd Settings-Management-System
```

2. **Install dependencies:**

```bash
   make install
```

3. **Open in VSCode:**
   - VSCode should automatically detect the Python interpreter at `backend/venv/bin/python`
   - If not, click the Python version in bottom-right corner and select `./backend/venv/bin/python`

4. **Run locally:**

```bash
   make dev-frontend  # Frontend on :5173
   make dev-backend   # Backend on :8000
```

5. **Or run with Docker:**

```bash
   make up     # Runs on :3000 (frontend) and :8000 (backend)
   make logs   # View logs
   make down   # Stop
```

## Commands

- `make help` - See all available commands
- `make format` - Format all code
- `make lint` - Lint all code
