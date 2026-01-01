const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencycontroller');
const protect = require('../middlewares/authmiddleware');

router.post('/', protect, emergencyController.createEmergency);
router.put('/:id/status', protect, emergencyController.updateEmergencyStatus);

module.exports = router;
