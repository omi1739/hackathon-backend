const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Workspace name is required." });

    const workspace = await prisma.workspace.create({
      data: {
        name,
        description,
        ownerId: req.user.id,
        members: { connect: { id: req.user.id } },
      },
      include: { members: { select: { id: true, name: true, email: true, role: true } } },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { workspaceId: workspace.id, role: "ADMIN" },
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error("Create workspace error:", error);
    res.status(500).json({ error: "Failed to create workspace." });
  }
};

exports.getAll = async (req, res) => {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { members: { some: { id: req.user.id } } },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, projects: true } },
      },
    });
    res.json(workspaces);
  } catch (error) {
    console.error("Get workspaces error:", error);
    res.status(500).json({ error: "Failed to fetch workspaces." });
  }
};

exports.getById = async (req, res) => {
  try {
    const workspace = await prisma.workspace.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        members: { select: { id: true, name: true, email: true, role: true, avatar: true } },
        projects: { include: { _count: { select: { tasks: true } } } },
      },
    });
    if (!workspace) return res.status(404).json({ error: "Workspace not found." });

    const isMember = workspace.members.some((m) => m.id === req.user.id);
    if (!isMember) return res.status(403).json({ error: "Access denied." });

    res.json(workspace);
  } catch (error) {
    console.error("Get workspace error:", error);
    res.status(500).json({ error: "Failed to fetch workspace." });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const workspace = await prisma.workspace.findUnique({ where: { id: req.params.id } });
    if (!workspace) return res.status(404).json({ error: "Workspace not found." });
    if (workspace.ownerId !== req.user.id) return res.status(403).json({ error: "Only owner can update." });

    const updated = await prisma.workspace.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(logo && { logo }) },
    });
    res.json(updated);
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).json({ error: "Failed to update workspace." });
  }
};

exports.remove = async (req, res) => {
  try {
    const workspace = await prisma.workspace.findUnique({ where: { id: req.params.id } });
    if (!workspace) return res.status(404).json({ error: "Workspace not found." });
    if (workspace.ownerId !== req.user.id) return res.status(403).json({ error: "Only owner can delete." });

    await prisma.workspace.delete({ where: { id: req.params.id } });
    res.json({ message: "Workspace deleted." });
  } catch (error) {
    console.error("Delete workspace error:", error);
    res.status(500).json({ error: "Failed to delete workspace." });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const workspace = await prisma.workspace.findUnique({ where: { id: req.params.id } });
    if (!workspace) return res.status(404).json({ error: "Workspace not found." });
    if (workspace.ownerId !== req.user.id) return res.status(403).json({ error: "Only owner can remove members." });

    await prisma.workspace.update({
      where: { id: req.params.id },
      data: { members: { disconnect: { id: req.params.memberId } } },
    });

    await prisma.user.update({
      where: { id: req.params.memberId },
      data: { workspaceId: null, role: "EDITOR" },
    });

    res.json({ message: "Member removed." });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Failed to remove member." });
  }
};
