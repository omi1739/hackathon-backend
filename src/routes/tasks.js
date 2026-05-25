const { Router } = require("express");
const { create, getByProject, getById, update, remove, approve } = require("../controllers/taskController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", create);
router.get("/project/:projectId", getByProject);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/:id/approve", approve);

module.exports = router;
