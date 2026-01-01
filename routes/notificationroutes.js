const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationcontroller');
const protect = require('../middlewares/authmiddleware');

router.get('/', protect, notificationController.getNotifications);
router.put('/:id/read', protect, notificationController.markAsRead);

module.exports = router;
