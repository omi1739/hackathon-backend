const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name, description, deadline, projectId } = req.body;
    if (!name || !projectId) return res.status(400).json({ error: "Name and projectId are required." });

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        projectId,
      },
    });
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Create campaign error:", error);
    res.status(500).json({ error: "Failed to create campaign." });
  }
};

exports.getByProject = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: { projectId: req.params.projectId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(campaigns);
  } catch (error) {
    console.error("Get campaigns error:", error);
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
};

exports.getById = async (req, res) => {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id: req.params.id },
      include: {
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, avatar: true } },
            _count: { select: { comments: true, assets: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    if (!campaign) return res.status(404).json({ error: "Campaign not found." });
    res.json(campaign);
  } catch (error) {
    console.error("Get campaign error:", error);
    res.status(500).json({ error: "Failed to fetch campaign." });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;
    const campaign = await prisma.campaign.update({
      where: { id: req.params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
      },
    });
    res.json(campaign);
  } catch (error) {
    console.error("Update campaign error:", error);
    res.status(500).json({ error: "Failed to update campaign." });
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.campaign.delete({ where: { id: req.params.id } });
    res.json({ message: "Campaign deleted." });
  } catch (error) {
    console.error("Delete campaign error:", error);
    res.status(500).json({ error: "Failed to delete campaign." });
  }
};
