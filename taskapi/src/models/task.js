const { randomUUID } = require('crypto');

// In-memory store — swap with a DB in production
let tasks = [];

const VALID_STATUSES = ['todo', 'in-progress', 'done'];

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function create({ title, description = '', status = 'todo' }) {
  if (!title || typeof title !== 'string' || title.trim() === '') {
    throw new Error('Title is required');
  }
  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const task = {
    id: randomUUID(),
    title: title.trim(),
    description: description.trim(),
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(task);
  return task;
}

function update(id, fields) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  const allowed = ['title', 'description', 'status'];
  const updates = {};

  for (const key of allowed) {
    if (fields[key] !== undefined) {
      updates[key] = fields[key];
    }
  }

  if (updates.status && !VALID_STATUSES.includes(updates.status)) {
    throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  tasks[index] = {
    ...tasks[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return tasks[index];
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

// For testing — reset store
function _reset() {
  tasks = [];
}

module.exports = { getAll, getById, create, update, remove, _reset };
