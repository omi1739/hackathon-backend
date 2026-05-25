const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name, description, workspaceId } = req.body;
    if (!name || !workspaceId) return res.status(400).json({ error: "Name and workspaceId are required." });

    const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!ws) return res.status(404).json({ error: "Workspace not found." });

    const project = await prisma.project.create({
      data: { name, description, workspaceId, createdById: req.user.id },
      include: { createdBy: { select: { id: true, name: true } } },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ error: "Failed to create project." });
  }
};

exports.getByWorkspace = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { workspaceId: req.params.workspaceId },
      include: {
        createdBy: { select: { id: true, name: true } },
        _count: { select: { tasks: true, campaigns: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ error: "Failed to fetch projects." });
  }
};

exports.getById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: { select: { id: true, name: true, avatar: true } },
        campaigns: { include: { _count: { select: { tasks: true } } } },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, avatar: true } },
            _count: { select: { comments: true, assets: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!project) return res.status(404).json({ error: "Project not found." });
    res.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Failed to fetch project." });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { ...(name && { name }), ...(description !== undefined && { description }), ...(status && { status }) },
    });
    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Failed to update project." });
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ message: "Project deleted." });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Failed to delete project." });
  }
};
