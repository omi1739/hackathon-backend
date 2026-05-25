const prisma = require("../config/prisma");

exports.getAll = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

exports.markRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, id: { in: req.body.ids || [req.params.id] } },
      data: { read: true },
    });
    res.json({ message: "Notifications marked as read." });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id },
      data: { read: true },
    });
    res.json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ error: "Failed to mark notifications as read." });
  }
};
