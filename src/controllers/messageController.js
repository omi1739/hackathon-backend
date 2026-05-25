const prisma = require("../config/prisma");

exports.send = async (req, res) => {
  try {
    const { content, channel } = req.body;
    if (!content) return res.status(400).json({ error: "Content is required." });

    const message = await prisma.message.create({
      data: { content, senderId: req.user.id, channel: channel || "general" },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
};

exports.getByChannel = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { channel: req.params.channel },
      include: { sender: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: "asc" },
      take: 100,
    });
    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages." });
  }
};
