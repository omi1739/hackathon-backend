const { Router } = require("express");
const { create, getByProject, getById, update, remove } = require("../controllers/campaignController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", create);
router.get("/project/:projectId", getByProject);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;
