const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['LOW', 'MODERATE', 'HIGH'],
        required: true
    },
    dueDate: {
        type: Date
    },
    checklist: [{
        title: {
            type: String,
            required: true
        },
        done: {
            type: Boolean,
            default: false
        }
    }],
    column: {
        type: String,
        enum: ['BACKLOG', 'TO-DO', 'PROGRESS', 'DONE'],
        default: 'To Do'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Set the default value to the current date/time
    }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
