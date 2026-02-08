import { Router } from 'express';
import {
  createPayment,
  getPaymentById,
  listPayments,
  updatePaymentStatus,
  initiateRefund,
  createPaymentValidation,
  getPaymentByIdValidation,
  listPaymentsValidation,
  updatePaymentStatusValidation,
  initiateRefundValidation,
} from './payment.controller';

const router = Router();

/**
 * @openapi
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create a new payment record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, paymentFor, provider, paidVia, paymentSummary]
 *             properties:
 *               userId: { type: string, description: MongoDB ObjectId }
 *               paymentFor:
 *                 type: object
 *                 properties:
 *                   serviceId: { type: string }
 *                   refId: { type: string }
 *               provider: { type: string, enum: [razorpay, stripe, cash] }
 *               paidVia: { type: string, enum: [razorpay, stripe, cash, upi, card] }
 *               transactionId: { type: string }
 *               orderId: { type: string }
 *               currency: { type: string, default: INR }
 *               paymentSummary:
 *                 type: object
 *                 properties:
 *                   serviceFee: { type: number }
 *                   discount: { type: number }
 *                   sgst: { type: number }
 *                   cgst: { type: number }
 *                   totalPayable: { type: number }
 *     responses:
 *       201: { description: Payment created successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post('/', createPaymentValidation, createPayment);

/**
 * @openapi
 * /payments:
 *   get:
 *     tags: [Payments]
 *     summary: List payments (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, default: 20 }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, paid, failed, refund_initiated, refunded] }
 *       - in: query
 *         name: provider
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date-time }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date-time }
 *     responses:
 *       200: { description: Paginated list of payments }
 */
router.get('/', listPaymentsValidation, listPayments);

/**
 * @openapi
 * /payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Payment details }
 *       404: { description: Payment not found }
 */
router.get('/:id', getPaymentByIdValidation, getPaymentById);

/**
 * @openapi
 * /payments/{id}/status:
 *   patch:
 *     tags: [Payments]
 *     summary: Update payment status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentStatus]
 *             properties:
 *               paymentStatus: { type: string, enum: [paid, failed] }
 *               transactionId: { type: string }
 *               failureReason:
 *                 type: object
 *                 properties:
 *                   code: { type: string }
 *                   message: { type: string }
 *     responses:
 *       200: { description: Payment status updated }
 *       404: { description: Payment not found }
 */
router.patch('/:id/status', updatePaymentStatusValidation, updatePaymentStatus);

/**
 * @openapi
 * /payments/{id}/refund:
 *   post:
 *     tags: [Payments]
 *     summary: Initiate refund
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, reason]
 *             properties:
 *               amount: { type: number }
 *               reason: { type: string }
 *     responses:
 *       200: { description: Refund initiated }
 *       400: { description: Bad request }
 */
router.post('/:id/refund', initiateRefundValidation, initiateRefund);

export const paymentRoutes = router;
