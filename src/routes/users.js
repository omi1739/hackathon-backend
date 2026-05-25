const { Router } = require("express");
const { getProfile, updateProfile, getWorkspaceMembers } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);
router.get("/me", getProfile);
router.put("/me", updateProfile);
router.get("/:id", getProfile);
router.get("/workspace/:workspaceId/members", getWorkspaceMembers);

module.exports = router;
