const { Router } = require("express");
const { invite, accept, decline, getPending } = require("../controllers/inviteController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.post("/", invite);
router.get("/pending", getPending);
router.post("/:id/accept", accept);
router.post("/:id/decline", decline);

module.exports = router;
