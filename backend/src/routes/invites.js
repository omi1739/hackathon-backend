const { Router } = require("express");
const { invite, accept, decline, getPending } = require("../controllers/inviteController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /invites:
 *   post:
 *     tags: [Invites]
 *     summary: Send an invite
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, workspaceId]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, ADMIN, MANAGER, EDITOR, VIEWER, CLIENT]
 *                 default: EDITOR
 *               workspaceId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Invite sent
 */
router.post("/", invite);

/**
 * @openapi
 * /invites/pending:
 *   get:
 *     tags: [Invites]
 *     summary: Get pending invites for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending invites
 */
router.get("/pending", getPending);

/**
 * @openapi
 * /invites/{id}/accept:
 *   post:
 *     tags: [Invites]
 *     summary: Accept an invite
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
 *         description: Invite accepted
 */
router.post("/:id/accept", accept);

/**
 * @openapi
 * /invites/{id}/decline:
 *   post:
 *     tags: [Invites]
 *     summary: Decline an invite
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
 *         description: Invite declined
 */
router.post("/:id/decline", decline);

module.exports = router;
