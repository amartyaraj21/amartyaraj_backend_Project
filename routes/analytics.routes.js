const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');

router.use(authMiddleware);

router.get('/counts', analyticsController.getAllCounts);

module.exports = router;
