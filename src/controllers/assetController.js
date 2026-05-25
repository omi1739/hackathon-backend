const prisma = require("../config/prisma");

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const { taskId } = req.body;
    const asset = await prisma.asset.create({
      data: {
        name: req.file.originalname,
        type: req.file.mimetype,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size,
        taskId: taskId || null,
        uploadedById: req.user.id,
      },
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file." });
  }
};

exports.getByTask = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { taskId: req.params.taskId },
      include: { uploadedBy: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(assets);
  } catch (error) {
    console.error("Get assets error:", error);
    res.status(500).json({ error: "Failed to fetch assets." });
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.json({ message: "Asset deleted." });
  } catch (error) {
    console.error("Delete asset error:", error);
    res.status(500).json({ error: "Failed to delete asset." });
  }
};
