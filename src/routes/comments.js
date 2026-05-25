const { Router } = require("express");
const { create, getByTask, remove } = require("../controllers/commentController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /comments:
 *   post:
 *     tags: [Comments]
 *     summary: Create a comment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content, taskId]
 *             properties:
 *               content:
 *                 type: string
 *               taskId:
 *                 type: string
 *               parentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post("/", create);

/**
 * @openapi
 * /comments/task/{taskId}:
 *   get:
 *     tags: [Comments]
 *     summary: Get comments by task
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */
router.get("/task/:taskId", getByTask);

/**
 * @openapi
 * /comments/{id}:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment
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
 *         description: Comment deleted
 */
router.delete("/:id", remove);

module.exports = router;
