const { Router } = require("express");
const { create, getAll, getById, update, remove, removeMember } = require("../controllers/workspaceController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /workspaces:
 *   post:
 *     tags: [Workspaces]
 *     summary: Create a workspace
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Workspace created
 */
router.post("/", create);

/**
 * @openapi
 * /workspaces:
 *   get:
 *     tags: [Workspaces]
 *     summary: Get all workspaces for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workspaces
 */
router.get("/", getAll);

/**
 * @openapi
 * /workspaces/{id}:
 *   get:
 *     tags: [Workspaces]
 *     summary: Get workspace by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace details
 */
router.get("/:id", getById);

/**
 * @openapi
 * /workspaces/{id}:
 *   put:
 *     tags: [Workspaces]
 *     summary: Update workspace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Workspace updated
 */
router.put("/:id", update);

/**
 * @openapi
 * /workspaces/{id}:
 *   delete:
 *     tags: [Workspaces]
 *     summary: Delete workspace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace deleted
 */
router.delete("/:id", remove);

/**
 * @openapi
 * /workspaces/{id}/members/{memberId}:
 *   delete:
 *     tags: [Workspaces]
 *     summary: Remove member from workspace
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete("/:id/members/:memberId", removeMember);

module.exports = router;
