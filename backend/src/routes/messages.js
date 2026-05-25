const { Router } = require("express");
const { send, getByChannel } = require("../controllers/messageController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /messages:
 *   post:
 *     tags: [Messages]
 *     summary: Send a message
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *               channel:
 *                 type: string
 *                 default: general
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post("/", send);

/**
 * @openapi
 * /messages/channel/{channel}:
 *   get:
 *     tags: [Messages]
 *     summary: Get messages by channel
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: channel
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get("/channel/:channel", getByChannel);

module.exports = router;
