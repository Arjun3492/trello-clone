const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    column: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Task', TaskSchema);
