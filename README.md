# Task Management Application

A dockerized web application for managing tasks, built with React and Express.

## Features

- View, create, update, and delete tasks
- Filter tasks by status (todo, in progress, done)
- Search tasks by title or description
- Responsive design for all device sizes
- Error handling for network issues

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express.js
- **Containerization**: Docker

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Node.js](https://nodejs.org/) (for local development)

### Running with Docker

1. Clone the repository
2. Run the application with Docker Compose:

```bash
docker-compose up --build
```

3. Access the application at http://localhost

### Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the backend server:

```bash
npm run server
```

3. In a separate terminal, start the frontend development server:

```bash
npm run dev
```

4. Access the application at the URL provided by Vite

## Project Structure

```
├── public/               # Static assets
├── server/               # Express backend
│   └── index.js          # Server entry point
├── src/                  # React frontend
│   ├── components/       # React components
│   ├── services/         # API services
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── Dockerfile.frontend   # Frontend Docker configuration
├── Dockerfile.backend    # Backend Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── nginx.conf            # Nginx configuration for production
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task