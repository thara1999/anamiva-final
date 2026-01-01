const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationcontroller');
const protect = require('../middlewares/authmiddleware');

router.post('/', protect, medicationController.addMedication);
router.get('/', protect, medicationController.getMedications);

module.exports = router;
