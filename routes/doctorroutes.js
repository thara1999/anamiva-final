const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorcontroller');
const protect = require('../middlewares/authmiddleware');

router.post('/create', protect, doctorController.createDoctorProfile);
router.get('/', doctorController.getDoctors);

module.exports = router;
