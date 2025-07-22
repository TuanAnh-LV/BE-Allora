const Notification = require('../models/notification.model');

exports.getNotifications = async (req, res) => {
  const userId = req.user.userId;
  const notifications = await Notification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']]
  });
  res.json(notifications.map(n => n.toSafeObject()));
};

exports.markAsRead = async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id;

  const noti = await Notification.findOne({
    where: { notification_id: id, user_id: userId }
  });

  if (!noti) return res.status(404).json({ message: 'Notification not found' });

  noti.is_read = true;
  await noti.save();

  res.json({ message: 'Marked as read' });
};

exports.getUnreadCount = async (req, res) => {
  const userId = req.user.userId;
  const count = await Notification.count({
    where: { user_id: userId, is_read: false }
  });
  res.json({ unread: count });
};