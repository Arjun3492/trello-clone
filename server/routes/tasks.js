const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middlewares/auth');
const Task = require('../models/Task');
const router = express.Router();

// Creating Task
router.post('/', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('column', 'Column is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { title, description, dueDate, column } = req.body;
    try {
        const newTask = new Task({
            title,
            description,
            dueDate,
            column,
            user: req.user.id
        });
        const task = await newTask.save();
        res.status(200).json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Fetching All Tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Updating Task
router.put('/:id', auth, async (req, res) => {
    const { title, description, dueDate, column } = req.body;
    const taskFields = {};
    if (title) taskFields.title = title;
    if (description) taskFields.description = description;
    if (dueDate) taskFields.dueDate = dueDate;
    if (column) taskFields.column = column;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        task = await Task.findByIdAndUpdate(req.params.id, { $set: taskFields }, { new: true });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Deleting Task
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        await Task.deleteOne(
            { _id: req.params.id }
        );
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
