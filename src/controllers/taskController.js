const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { title, description, priority, dueDate, projectId, campaignId, assigneeId, parentId } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required." });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        campaignId,
        assigneeId,
        parentId,
        createdById: req.user.id,
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    const workspace = await getTaskWorkspace(task.id);
    if (workspace) {
      const io = req.app.get("io");
      io?.to(`workspace:${workspace.id}`).emit("task-changed", { action: "created", task });
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task." });
  }
};

exports.getByProject = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId, parentId: null },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        subtasks: { include: { assignee: { select: { id: true, name: true, avatar: true } } } },
        _count: { select: { comments: true, assets: true } },
      },
      orderBy: [{ priority: "asc" }, { createdAt: "desc" }],
    });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
};

exports.getById = async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        createdBy: { select: { id: true, name: true, avatar: true } },
        subtasks: { include: { assignee: { select: { id: true, name: true, avatar: true } } } },
        comments: {
          include: {
            author: { select: { id: true, name: true, avatar: true } },
            replies: { include: { author: { select: { id: true, name: true, avatar: true } } } },
          },
          orderBy: { createdAt: "asc" },
        },
        assets: true,
        approvals: { include: { reviewer: { select: { id: true, name: true, avatar: true } } } },
      },
    });
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ error: "Failed to fetch task." });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assigneeId } = req.body;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId: assigneeId || null }),
      },
      include: {
        assignee: { select: { id: true, name: true, avatar: true } },
        createdBy: { select: { id: true, name: true } },
      },
    });

    const workspace = await getTaskWorkspace(task.id);
    if (workspace) {
      const io = req.app.get("io");
      io?.to(`workspace:${workspace.id}`).emit("task-changed", { action: "updated", task });
    }

    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task." });
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } });
    res.json({ message: "Task deleted." });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task." });
  }
};

exports.approve = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const validStatuses = ["APPROVED", "CHANGES_REQUESTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status must be APPROVED or CHANGES_REQUESTED." });
    }

    const approval = await prisma.approval.create({
      data: {
        taskId: req.params.id,
        reviewerId: req.user.id,
        status,
        feedback,
      },
      include: { reviewer: { select: { id: true, name: true, avatar: true } } },
    });

    await prisma.task.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.status(201).json(approval);
  } catch (error) {
    console.error("Approve task error:", error);
    res.status(500).json({ error: "Failed to process approval." });
  }
};

async function getTaskWorkspace(taskId) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { workspace: true } }, campaign: { include: { project: { include: { workspace: true } } } } },
  });
  if (task?.project) return task.project.workspace;
  if (task?.campaign?.project) return task.campaign.project.workspace;
  return null;
}
