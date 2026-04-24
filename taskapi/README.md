# Task API

A clean, minimal REST API for task management built with **Node.js + Express**.

## Project Structure

```
taskapi/
├── index.js                  # Server entry point
├── src/
│   ├── app.js                # Express app (middleware + routes)
│   ├── routes/
│   │   └── tasks.js          # Route definitions
│   ├── controllers/
│   │   └── taskController.js # Request handlers
│   ├── models/
│   │   └── task.js           # In-memory data store + business logic
│   └── middleware/
│       └── errorHandler.js   # 404 & global error middleware
└── tests/
    └── tasks.test.js         # Integration tests (Jest + Supertest)
```

## Getting Started

```bash
npm install
npm run dev       # Development (auto-reload)
npm start         # Production
npm test          # Run tests
npm run test:coverage  # Tests + coverage report
```

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | /health           | Health check             |
| GET    | /api/tasks        | List all tasks           |
| GET    | /api/tasks?status=todo | Filter by status    |
| GET    | /api/tasks/:id    | Get a single task        |
| POST   | /api/tasks        | Create a task            |
| PATCH  | /api/tasks/:id    | Update a task            |
| DELETE | /api/tasks/:id    | Delete a task            |

## Task Schema

```json
{
  "id": "uuid",
  "title": "string (required)",
  "description": "string",
  "status": "todo | in-progress | done",
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

## Example Requests

```bash
# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "status": "todo"}'

# Update status
curl -X PATCH http://localhost:3000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'

# Filter by status
curl http://localhost:3000/api/tasks?status=in-progress
```
