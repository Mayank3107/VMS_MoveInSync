const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/Employee');
const authenticate = require('../middleware/auth');

router.get('/visit-requests', authenticate, EmployeeController.getVisitRequests);
router.patch('/visit-requests/:id/accept', authenticate, EmployeeController.acceptRequest);
router.patch('/visit-requests/:id/reject', authenticate, EmployeeController.rejectRequest);
router.post('/create-visit', authenticate, EmployeeController.createVisit);

module.exports = router;
