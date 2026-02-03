import { Router } from 'express';
import {
  createSubscription,
  getSubscriptionById,
  listSubscriptions,
  listSubscriptionPlans,
  updateSubscription,
  deleteSubscription,
  createSubscriptionValidation,
  getSubscriptionByIdValidation,
  listSubscriptionsValidation,
  updateSubscriptionValidation,
  deleteSubscriptionValidation,
} from './subscription.controller';
import { authMiddleware, verifyFirebaseTokenMiddleware } from '../../common/middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /subscriptions:
 *   post:
 *     tags: [Subscriptions]
 *     summary: Create a subscription plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               price: { type: number }
 *               currency: { type: string }
 *               durationInDays: { type: integer }
 *               features: { type: array, items: { type: string } }
 *               isSystemPlan: { type: boolean }
 *     responses:
 *       201: { description: Subscription created }
 *       400: { description: Validation error }
 *       409: { description: Code already exists }
 */
router.post('/', authMiddleware, createSubscriptionValidation, createSubscription);

/**
 * @openapi
 * /subscriptions/plans:
 *   get:
 *     tags: [Subscriptions]
 *     summary: List subscription plans for onboarding (Firebase token only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 50 }
 *     responses:
 *       200: { description: Paginated list of subscription plans }
 */
router.get('/plans', verifyFirebaseTokenMiddleware, listSubscriptionsValidation, listSubscriptionPlans);

/**
 * @openapi
 * /subscriptions:
 *   get:
 *     tags: [Subscriptions]
 *     summary: List subscriptions (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list of subscriptions }
 */
router.get('/', authMiddleware, listSubscriptionsValidation, listSubscriptions);

/**
 * @openapi
 * /subscriptions/{id}:
 *   get:
 *     tags: [Subscriptions]
 *     summary: Get subscription by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Subscription found }
 *       404: { description: Subscription not found }
 */
router.get('/:id', getSubscriptionByIdValidation, getSubscriptionById);

/**
 * @openapi
 * /subscriptions/{id}:
 *   patch:
 *     tags: [Subscriptions]
 *     summary: Update subscription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               code: { type: string }
 *               price: { type: number }
 *               updatedBy: { type: string, description: Optional UUID of updater }
 *     responses:
 *       200: { description: Subscription updated }
 *       404: { description: Subscription not found }
 */
router.patch('/:id', updateSubscriptionValidation, updateSubscription);

/**
 * @openapi
 * /subscriptions/{id}:
 *   delete:
 *     tags: [Subscriptions]
 *     summary: Delete subscription (system plans cannot be deleted)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Subscription deleted }
 *       400: { description: Cannot delete system plan }
 *       404: { description: Subscription not found }
 */
router.delete('/:id', authMiddleware, deleteSubscriptionValidation, deleteSubscription);

export const subscriptionRoutes = router;
