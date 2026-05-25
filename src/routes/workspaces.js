const { Router } = require("express");
const { create, getAll, getById, update, remove, removeMember } = require("../controllers/workspaceController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);
router.delete("/:id/members/:memberId", removeMember);

module.exports = router;
