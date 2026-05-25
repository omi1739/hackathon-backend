const { Router } = require("express");
const { create, getByWorkspace, getById, update, remove } = require("../controllers/projectController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", create);
router.get("/workspace/:workspaceId", getByWorkspace);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
