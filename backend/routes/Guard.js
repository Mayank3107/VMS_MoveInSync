const express = require('express');
const router = express.Router();
const guardController = require('../controllers/Guard');
const authenticate = require('../middleware/auth'); // Assuming this exists

// Guard verifies QR code
router.post('/verify-visit', authenticate, guardController.verifyVisit);

// Mark visitor entry
router.patch('/visit-entry/:id', authenticate, guardController.markEntry);

// Mark visitor exit
router.patch('/visit-exit/:id', authenticate, guardController.markExit);

module.exports = router;
