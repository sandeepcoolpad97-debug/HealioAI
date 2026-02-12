import { Router } from 'express';
import {
    createHistoryEntry,
    getHistoryByTicketId,
    listHistory,
    createHistoryEntryValidation,
    getHistoryByTicketIdValidation,
    listHistoryValidation,
} from './supportTicketHistory.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: SupportTicketHistory
 *   description: Support ticket history and audit trail
 */

/**
 * @openapi
 * /support-ticket-history:
 *   post:
 *     tags: [SupportTicketHistory]
 *     summary: Create a history entry (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ticketId, action, performedByRole]
 *             properties:
 *               ticketId: { type: string }
 *               action: { type: string, enum: [created, user_reply, agent_reply, status_changed, priority_changed, category_changed, assigned, closed, reopened] }
 *               message: { type: string }
 *               oldValue: { type: object }
 *               newValue: { type: object }
 *               performedByRole: { type: string, enum: [User, Clinic, Lab, Admin, SupportAgent, System] }
 *               performedById: { type: string }
 *               attachments: { type: array }
 *     responses:
 *       201: { description: History entry created }
 */
router.post('/', createHistoryEntryValidation, createHistoryEntry);

/**
 * @openapi
 * /support-ticket-history/ticket/{ticketId}:
 *   get:
 *     tags: [SupportTicketHistory]
 *     summary: Get history for a specific ticket
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Ticket history retrieved }
 */
router.get('/ticket/:ticketId', getHistoryByTicketIdValidation, getHistoryByTicketId);

/**
 * @openapi
 * /support-ticket-history:
 *   get:
 *     tags: [SupportTicketHistory]
 *     summary: List history entries with filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: ticketId
 *         schema: { type: string }
 *       - in: query
 *         name: action
 *         schema: { type: string }
 *       - in: query
 *         name: performedByRole
 *         schema: { type: string }
 *     responses:
 *       200: { description: History list retrieved }
 */
router.get('/', listHistoryValidation, listHistory);

export const supportTicketHistoryRoutes = router;
