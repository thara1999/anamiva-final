const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentcontroller');
const protect = require('../middlewares/authmiddleware');

router.post('/', protect, appointmentController.createAppointment);
router.get('/', protect, appointmentController.getAppointments);

module.exports = router;
