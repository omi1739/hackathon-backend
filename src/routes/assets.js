const { Router } = require("express");
const { upload, getByTask, remove } = require("../controllers/assetController");
const { authenticate } = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /assets/upload:
 *   post:
 *     tags: [Assets]
 *     summary: Upload a file
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               taskId:
 *                 type: string
 *     responses:
 *       201:
 *         description: File uploaded
 */
router.post("/upload", uploadMiddleware.single("file"), upload);

/**
 * @openapi
 * /assets/task/{taskId}:
 *   get:
 *     tags: [Assets]
 *     summary: Get assets by task
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
 *         description: List of assets
 */
router.get("/task/:taskId", getByTask);

/**
 * @openapi
 * /assets/{id}:
 *   delete:
 *     tags: [Assets]
 *     summary: Delete an asset
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
 *         description: Asset deleted
 */
router.delete("/:id", remove);

module.exports = router;
