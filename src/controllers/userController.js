const prisma = require("../config/prisma");

exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id || req.user.id },
      select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name }), ...(avatar && { avatar }) },
      select: { id: true, name: true, email: true, avatar: true, role: true },
    });
    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

exports.getWorkspaceMembers = async (req, res) => {
  try {
    const members = await prisma.user.findMany({
      where: { workspaceId: req.params.workspaceId },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });
    res.json(members);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ error: "Failed to fetch members." });
  }
};
