const express = require('express');
const router = express.Router();
const VisitorController = require('../controllers/Visitor');
const authMiddleware = require('../middleware/auth');

//visitor send a visit request
router.post('/request', authMiddleware, VisitorController.sendRequest);
//visitor all request data
router.get('/requests', authMiddleware, VisitorController.getRequests);

module.exports = router;