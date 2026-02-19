import { Router } from 'express';
import { authMiddleware } from '../../common/middlewares/auth.middleware';
import {
    createReview,
    getReviewById,
    listReviews,
    updateReview,
    deleteReview,
    createReviewValidation,
    getReviewByIdValidation,
    listReviewsValidation,
    updateReviewValidation,
    deleteReviewValidation,
} from './review.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Review ID
 *         appointmentId:
 *           type: string
 *           description: Associated Appointment ID
 *         userId:
 *           type: string
 *           description: User who submitted the review
 *         reviewFor:
 *           type: string
 *           enum: [Clinic, Lab]
 *           description: Type of entity being reviewed
 *         reviewForId:
 *           type: string
 *           description: ID of the Clinic or Lab being reviewed
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating score
 *         comment:
 *           type: string
 *           description: Review comment
 *         isActive:
 *           type: boolean
 *         isDeleted:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - appointmentId
 *               - userId
 *               - reviewFor
 *               - reviewForId
 *               - rating
 *             properties:
 *               appointmentId:
 *                 type: string
 *               userId:
 *                 type: string
 *               reviewFor:
 *                 type: string
 *                 enum: [Clinic, Lab]
 *               reviewForId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Review already exists for this appointment
 */
router.post(
    '/',
    authMiddleware,
    ...createReviewValidation,
    createReview
);

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
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
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: reviewFor
 *         schema:
 *           type: string
 *           enum: [Clinic, Lab]
 *         description: Filter by review type
 *       - in: query
 *         name: reviewForId
 *         schema:
 *           type: string
 *         description: Filter by Clinic/Lab ID
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get(
    '/',
    authMiddleware,
    ...listReviewsValidation,
    listReviews
);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */
router.get(
    '/:id',
    authMiddleware,
    ...getReviewByIdValidation,
    getReviewById
);

/**
 * @swagger
 * /reviews/{id}:
 *   patch:
 *     summary: Update review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 */
router.patch(
    '/:id',
    authMiddleware,
    ...updateReviewValidation,
    updateReview
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
router.delete(
    '/:id',
    authMiddleware,
    ...deleteReviewValidation,
    deleteReview
);

export const reviewRoutes = router;
