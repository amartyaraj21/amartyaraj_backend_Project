const Task = require('../models/tasks.model.js');
const ApiResponse = require('../utils/ApiResponse');

const getAllCounts = async (req, res) => {
    try {
        const userId = req.user._id;
        const counts = {
            backlog: await Task.countDocuments({ column: 'BACKLOG', user: userId }),
            todo: await Task.countDocuments({ column: 'TO-DO', user: userId }),
            inProgress: await Task.countDocuments({ column: 'PROGRESS', user: userId }),
            completed: await Task.countDocuments({ column: 'DONE', user: userId }),
            lowPriority: await Task.countDocuments({ priority: 'LOW', user: userId }),
            moderatePriority: await Task.countDocuments({ priority: 'MODERATE', user: userId }),
            highPriority: await Task.countDocuments({ priority: 'HIGH', user: userId }),
            dueDate: await Task.countDocuments({ dueDate: { $exists: true }, user: userId })
        };
        ApiResponse(res, 200, 'Counts fetched successfully', counts);
    } catch (error) {
        console.error('Error fetching counts:', error);
        ApiResponse(res, 500, 'Internal server error');
    }
};

module.exports = {
    getAllCounts
};
