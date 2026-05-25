const { Router } = require("express");
const { create, getByTask, remove } = require("../controllers/commentController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", create);
router.get("/task/:taskId", getByTask);
router.delete("/:id", remove);

module.exports = router;
