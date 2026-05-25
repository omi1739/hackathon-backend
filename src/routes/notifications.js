const { Router } = require("express");
const { getAll, markRead, markAllRead } = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.get("/", getAll);
router.put("/:id/read", markRead);
router.put("/read-all", markAllRead);

module.exports = router;
