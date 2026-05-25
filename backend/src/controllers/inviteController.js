const prisma = require("../config/prisma");

exports.invite = async (req, res) => {
  try {
    const { email, role, workspaceId } = req.body;
    if (!email || !workspaceId) return res.status(400).json({ error: "Email and workspaceId are required." });

    const ws = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!ws) return res.status(404).json({ error: "Workspace not found." });

    const existing = await prisma.invite.findFirst({
      where: { email, workspaceId, status: "PENDING" },
    });
    if (existing) return res.status(409).json({ error: "Invite already sent to this email." });

    const invite = await prisma.invite.create({
      data: { email, role: role || "EDITOR", workspaceId, senderId: req.user.id },
      include: { workspace: { select: { name: true } } },
    });

    res.status(201).json(invite);
  } catch (error) {
    console.error("Invite error:", error);
    res.status(500).json({ error: "Failed to send invite." });
  }
};

exports.accept = async (req, res) => {
  try {
    const invite = await prisma.invite.findUnique({
      where: { id: req.params.id },
      include: { workspace: true },
    });
    if (!invite) return res.status(404).json({ error: "Invite not found." });
    if (invite.status !== "PENDING") return res.status(400).json({ error: "Invite already processed." });
    if (invite.email !== req.user.email) return res.status(403).json({ error: "This invite is not for you." });

    await prisma.invite.update({
      where: { id: req.params.id },
      data: { status: "ACCEPTED" },
    });

    await prisma.workspace.update({
      where: { id: invite.workspaceId },
      data: { members: { connect: { id: req.user.id } } },
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { workspaceId: invite.workspaceId, role: invite.role },
    });

    res.json({ message: "Invite accepted." });
  } catch (error) {
    console.error("Accept invite error:", error);
    res.status(500).json({ error: "Failed to accept invite." });
  }
};

exports.decline = async (req, res) => {
  try {
    const invite = await prisma.invite.findUnique({ where: { id: req.params.id } });
    if (!invite) return res.status(404).json({ error: "Invite not found." });

    await prisma.invite.update({
      where: { id: req.params.id },
      data: { status: "DECLINED" },
    });

    res.json({ message: "Invite declined." });
  } catch (error) {
    console.error("Decline invite error:", error);
    res.status(500).json({ error: "Failed to decline invite." });
  }
};

exports.getPending = async (req, res) => {
  try {
    const invites = await prisma.invite.findMany({
      where: { email: req.user.email, status: "PENDING" },
      include: { workspace: { select: { id: true, name: true } }, sender: { select: { id: true, name: true } } },
    });
    res.json(invites);
  } catch (error) {
    console.error("Get invites error:", error);
    res.status(500).json({ error: "Failed to fetch invites." });
  }
};
