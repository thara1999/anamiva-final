const Notification = require('../models/notification');

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user.id });
  res.json({ success: true, notifications });
};

exports.markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true, message: 'Notification marked as read' });
};
