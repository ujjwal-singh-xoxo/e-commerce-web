# E-Commerce Web

## Prerequisites

- Python
- [`uv`](https://docs.astral.sh/uv/)
- Node.js and npm
- PostgreSQL

## Backend Setup

```bash
cd backend
uv sync
```

Configure the local PostgreSQL database and create a `.env` file with the required environment variables.

Run database migrations:

```bash
uv run python manage.py migrate
```

Start the Django development server:

```bash
uv run python manage.py runserver
```

## Frontend Setup

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal.

## Running the Project

Run the backend and frontend simultaneously in separate terminals.

- **Backend:** Django development server, usually `http://127.0.0.1:8000/`
- **Frontend:** Vite development server, using the URL printed in its terminal

Make sure the frontend's API configuration points to the local backend.
