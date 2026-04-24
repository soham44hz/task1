const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');

beforeEach(() => {
  Task._reset();
});

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/tasks', () => {
  it('creates a task with valid data', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Write tests', description: 'Cover all routes' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Write tests');
    expect(res.body.status).toBe('todo');
    expect(res.body.id).toBeDefined();
  });

  it('rejects a task with no title', async () => {
    const res = await request(app).post('/api/tasks').send({ description: 'No title here' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('rejects an invalid status', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Bad status', status: 'flying' });
    expect(res.status).toBe(400);
  });
});

describe('GET /api/tasks', () => {
  it('returns an empty list initially', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it('returns all tasks', async () => {
    Task.create({ title: 'Task A' });
    Task.create({ title: 'Task B' });

    const res = await request(app).get('/api/tasks');
    expect(res.body.count).toBe(2);
  });

  it('filters tasks by status', async () => {
    Task.create({ title: 'Task A', status: 'todo' });
    Task.create({ title: 'Task B', status: 'done' });

    const res = await request(app).get('/api/tasks?status=done');
    expect(res.body.count).toBe(1);
    expect(res.body.tasks[0].title).toBe('Task B');
  });
});

describe('GET /api/tasks/:id', () => {
  it('returns a task by id', async () => {
    const task = Task.create({ title: 'Find me' });
    const res = await request(app).get(`/api/tasks/${task.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(task.id);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/tasks/nonexistent-id');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/tasks/:id', () => {
  it('updates a task', async () => {
    const task = Task.create({ title: 'Old title' });
    const res = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .send({ title: 'New title', status: 'in-progress' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('New title');
    expect(res.body.status).toBe('in-progress');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).patch('/api/tasks/ghost').send({ title: 'Nope' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('deletes a task', async () => {
    const task = Task.create({ title: 'Delete me' });
    const res = await request(app).delete(`/api/tasks/${task.id}`);
    expect(res.status).toBe(204);
  });

  it('returns 404 when task does not exist', async () => {
    const res = await request(app).delete('/api/tasks/ghost');
    expect(res.status).toBe(404);
  });
});

describe('Unknown route', () => {
  it('returns 404 for undefined routes', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
