const Task = require('../models/task');

function listTasks(req, res) {
  const { status } = req.query;
  let tasks = Task.getAll();

  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  res.json({ count: tasks.length, tasks });
}

function getTask(req, res, next) {
  const task = Task.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
}

function createTask(req, res, next) {
  try {
    const task = Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function updateTask(req, res, next) {
  try {
    const task = Task.update(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

function deleteTask(req, res) {
  const deleted = Task.remove(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).send();
}

module.exports = { listTasks, getTask, createTask, updateTask, deleteTask };
