const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { content, taskId, parentId } = req.body;
    if (!content || !taskId) return res.status(400).json({ error: "Content and taskId are required." });

    const comment = await prisma.comment.create({
      data: { content, taskId, authorId: req.user.id, parentId: parentId || null },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ error: "Failed to create comment." });
  }
};

exports.getByTask = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.taskId, parentId: null },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        replies: { include: { author: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
};

exports.remove = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.authorId !== req.user.id) return res.status(403).json({ error: "Not authorized." });

    await prisma.comment.delete({ where: { id: req.params.id } });
    res.json({ message: "Comment deleted." });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ error: "Failed to delete comment." });
  }
};
