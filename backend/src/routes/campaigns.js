const { Router } = require("express");
const { create, getByProject, getById, update, remove } = require("../controllers/campaignController");
const { authenticate } = require("../middleware/auth");

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /campaigns:
 *   post:
 *     tags: [Campaigns]
 *     summary: Create a campaign
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, projectId]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campaign created
 */
router.post("/", create);

/**
 * @openapi
 * /campaigns/project/{projectId}:
 *   get:
 *     tags: [Campaigns]
 *     summary: Get campaigns by project
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of campaigns
 */
router.get("/project/:projectId", getByProject);

/**
 * @openapi
 * /campaigns/{id}:
 *   get:
 *     tags: [Campaigns]
 *     summary: Get campaign by ID
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
 *         description: Campaign details
 */
router.get("/:id", getById);

/**
 * @openapi
 * /campaigns/{id}:
 *   put:
 *     tags: [Campaigns]
 *     summary: Update campaign
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
 *               status:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Campaign updated
 */
router.put("/:id", update);

/**
 * @openapi
 * /campaigns/{id}:
 *   delete:
 *     tags: [Campaigns]
 *     summary: Delete campaign
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
 *         description: Campaign deleted
 */
router.delete("/:id", remove);

module.exports = router;
