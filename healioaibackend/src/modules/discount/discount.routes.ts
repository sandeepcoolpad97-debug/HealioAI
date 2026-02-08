import { Router } from 'express';
import { DiscountController } from './discount.controller';
import { validateBody } from '../../common/validation/validate';
import { createDiscountSchema, updateDiscountSchema } from './discount.validation';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = Router();
const discountController = new DiscountController();

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Discount management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Discount ID
 *         name:
 *           type: string
 *           description: Discount name
 *         description:
 *           type: string
 *           description: Discount description
 *         price:
 *           type: number
 *           description: Discount amount
 *         serviceId:
 *           type: string
 *           description: Associated Service ID
 *         rule:
 *           type: object
 *           description: Discount rules (JSON)
 *         isActive:
 *           type: boolean
 *           description: Is discount active
 *         isDeleted:
 *           type: boolean
 *           description: Is discount deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         createdBy:
 *           type: string
 *           description: User ID who created the discount
 *         updatedBy:
 *           type: string
 *           description: User ID who updated the discount
 */

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Create a new discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - serviceId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               serviceId:
 *                 type: string
 *               rule:
 *                 type: object
 *     responses:
 *       201:
 *         description: Discount created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Service not found
 */
router.post(
  '/',
  authMiddleware,
  validateBody(createDiscountSchema),
  discountController.create
);

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
 *       - in: query
 *         name: serviceId
 *         schema:
 *           type: string
 *         description: Filter by Service ID
 *     responses:
 *       200:
 *         description: List of discounts
 */
router.get(
  '/',
  authMiddleware,
  discountController.list
);

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Get discount by ID
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount ID
 *     responses:
 *       200:
 *         description: Discount details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       404:
 *         description: Discount not found
 */
router.get(
  '/:id',
  authMiddleware,
  discountController.getById
);

/**
 * @swagger
 * /discounts/{id}:
 *   patch:
 *     summary: Update discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount ID
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
 *               price:
 *                 type: number
 *               serviceId:
 *                 type: string
 *               rule:
 *                 type: object
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Discount'
 *       404:
 *         description: Discount or Service not found
 */
router.patch(
  '/:id',
  authMiddleware,
  validateBody(updateDiscountSchema),
  discountController.update
);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Delete discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Discount ID
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       404:
 *         description: Discount not found
 */
router.delete(
  '/:id',
  authMiddleware,
  discountController.delete
);

export const discountRoutes = router;
