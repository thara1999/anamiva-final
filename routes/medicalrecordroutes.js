const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalrecordcontroller');
const protect = require('../middlewares/authmiddleware');

router.post('/', protect, medicalRecordController.createMedicalRecord);
router.get('/', protect, medicalRecordController.getMedicalRecords);

module.exports = router;
