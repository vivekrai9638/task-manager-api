const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

// Resource creation endpoint

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();

    res.status(201).send(task);
  } catch {
    res.send(400).send();
  }
});

// Resource reading enpoints

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  if (req.query.completed) match.isCompleted = req.query.completed === "true";

  const sort = {};
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "asc" ? 1 : -1;
  }

  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        sort,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
        },
      })
      .execPopulate();

    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send();

    res.send(task);
  } catch {
    res.send(500).send();
  }
});

// Resource updating endpoints

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "isCompleted"];

  const isAllowed = updates.every((update) => allowedUpdates.includes(update));
  if (!isAllowed)
    return res.send(400).send({ error: "Invalid update request" });

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.send(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));

    await task.save();
    res.send(task);
  } catch {
    res.send(500).send();
  }
});

// resource deleting endpoints

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!task) return res.status(404).send();
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
