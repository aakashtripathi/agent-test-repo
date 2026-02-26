# To-Do App

A simple, full-stack to-do application with FastAPI backend and React frontend, ready to deploy locally using Docker Compose.

## Features

- ✓ Create, read, update, and delete tasks
- ✓ Mark tasks as complete
- ✓ Beautiful, responsive UI
- ✓ Single command local deployment
- ✓ Persistent SQLite database

## Tech Stack

- **Backend**: FastAPI + SQLAlchemy + SQLite
- **Frontend**: React + Vite
- **Deployment**: Docker + Docker Compose

## Quick Start

### Prerequisites
- Docker and Docker Compose installed

### Run Locally

```bash
docker-compose up
```

This will:
1. Build and start the backend on `http://localhost:8000`
2. Build and start the frontend on `http://localhost:3000`

### Access the App

- **Frontend**: Open `http://localhost:3000` in your browser
- **Backend API Docs**: Visit `http://localhost:8000/docs` for interactive Swagger documentation

## API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/{id}` - Get a specific task
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

## Project Structure

```
.
├── backend/
│   ├── main.py           # FastAPI app & routes
│   ├── models.py         # SQLAlchemy models
│   ├── database.py       # Database setup
│   ├── requirements.txt   # Python dependencies
│   └── Dockerfile        # Backend container
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main React component
│   │   ├── components/   # React components
│   │   └── index.css     # Styles
│   ├── package.json      # Node dependencies
│   ├── vite.config.js    # Vite config
│   └── Dockerfile        # Frontend container
└── docker-compose.yml    # Multi-container setup

```

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Database

Tasks are persisted in a local SQLite database (`todos.db`). The database is automatically created on first run.

## Stopping the App

```bash
docker-compose down
```

To remove the database volume as well:
```bash
docker-compose down -v
```
