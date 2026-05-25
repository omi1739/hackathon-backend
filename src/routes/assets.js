const { Router } = require("express");
const { upload, getByTask, remove } = require("../controllers/assetController");
const { authenticate } = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");

const router = Router();

router.use(authenticate);
router.post("/upload", uploadMiddleware.single("file"), upload);
router.get("/task/:taskId", getByTask);
router.delete("/:id", remove);

module.exports = router;
