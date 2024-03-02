const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const taskController = require('../controllers/task.controller.js');


// Middleware to authenticate requests
router.use(authMiddleware);

// Routes for tasks
router.post('/', taskController.createTask); // Create a new task
router.get('/', taskController.getAllTasks); // Get all tasks for a user
router.get('/:id', taskController.getTaskById); // Get a task by ID
router.put('/:id', taskController.updateTask); // Update a task
router.delete('/:id', taskController.deleteTask); // Delete a task
router.put('/:taskId/column',taskController.updateTaskColumn);//update the column 

// Route for filtering tasks by creation date
router.get('/filter/:filter', taskController. getTasksByFilter);


module.exports = router;
