import { Router } from 'express';
import {
  generateSlots,
  getSlots,
  lockSlot,
  unlockSlot
} from './slotTracker.controller';
import {
  generateSlotsSchema,
  getSlotsQuerySchema,
  slotIdParamSchema
} from './slotTracker.validation';
import { validateBody, validateQuery, validateParams } from '../../common/validation/validate';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /slots/generate:
 *   post:
 *     tags: [Slots]
 *     summary: Generate slots for a doctor on a specific date
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, date, startTime, endTime]
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: Doctor ID (MongoDB ObjectId)
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-03-20"
 *               startTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 example: "09:00"
 *               endTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 example: "17:00"
 *               durationMinutes:
 *                 type: number
 *                 default: 30
 *     responses:
 *       201:
 *         description: Slots generated successfully
 *       400:
 *         description: Invalid input or start time after end time
 *       409:
 *         description: Slots already exist
 */
router.post(
    '/generate',
    authMiddleware,
    validateBody(generateSlotsSchema),
    generateSlots
);

/**
 * @openapi
 * /slots:
 *   get:
 *     tags: [Slots]
 *     summary: Get slots for a doctor on a specific date
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, locked, booked, cancelled]
 *         description: Filter by slot status
 *     responses:
 *       200:
 *         description: List of slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       date: { type: string }
 *                       slotStartAt: { type: string, format: date-time }
 *                       slotEndAt: { type: string, format: date-time }
 *                       status: { type: string }
 */
router.get(
    '/',
    validateQuery(getSlotsQuerySchema),
    getSlots
);

/**
 * @openapi
 * /slots/{id}/lock:
 *   post:
 *     tags: [Slots]
 *     summary: Lock a slot temporarily
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot ID
 *     responses:
 *       200:
 *         description: Slot locked successfully
 *       404:
 *         description: Slot not found
 *       409:
 *         description: Slot not available
 */
router.post(
    '/:id/lock',
    authMiddleware,
    validateParams(slotIdParamSchema),
    lockSlot
);

/**
 * @openapi
 * /slots/{id}/unlock:
 *   post:
 *     tags: [Slots]
 *     summary: Unlock a slot
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Slot ID
 *     responses:
 *       200:
 *         description: Slot unlocked successfully
 *       400:
 *         description: Slot not locked
 *       403:
 *         description: Forbidden (cannot unlock slot locked by another user)
 *       404:
 *         description: Slot not found
 */
router.post(
    '/:id/unlock',
    authMiddleware,
    validateParams(slotIdParamSchema),
    unlockSlot
);

export default router;
