const { Router } = require("express");
const { send, getByChannel } = require("../controllers/messageController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", send);
router.get("/channel/:channel", getByChannel);

module.exports = router;
