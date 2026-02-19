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
 *       201:
 *         description: History entry created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Created history entry
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     action: { type: string }
 *                     message: { type: string }
 *                     oldValue: { type: object }
 *                     newValue: { type: object }
 *                     performedByRole: { type: string }
 *                     performedById: { type: string }
 *                     attachments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           fileName: { type: string }
 *                           fileUrl: { type: string }
 *                           fileType: { type: string }
 *                           fileSize: { type: number }
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
 *       200:
 *         description: Ticket history retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: History entry
 *                     properties:
 *                       _id: { type: string }
 *                       ticketId: { type: string }
 *                       action: { type: string }
 *                       message: { type: string }
 *                       oldValue: { type: object }
 *                       newValue: { type: object }
 *                       performedByRole: { type: string }
 *                       performedById:
 *                         oneOf:
 *                           - type: string
 *                           - type: object
 *                             nullable: true
 *                             properties:
 *                               _id: { type: string }
 *                               name: { type: string }
 *                               email: { type: string }
 *                               clinicName: { type: string }
 *                               labName: { type: string }
 *                               emailId: { type: string }
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             fileName: { type: string }
 *                             fileUrl: { type: string }
 *                             fileType: { type: string }
 *                             fileSize: { type: number }
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
 *       200:
 *         description: History list retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: History entry
 *                     properties:
 *                       _id: { type: string }
 *                       ticketId: { type: string }
 *                       action: { type: string }
 *                       message: { type: string }
 *                       oldValue: { type: object }
 *                       newValue: { type: object }
 *                       performedByRole: { type: string }
 *                       performedById:
 *                         oneOf:
 *                           - type: string
 *                           - type: object
 *                             nullable: true
 *                             properties:
 *                               _id: { type: string }
 *                               name: { type: string }
 *                               email: { type: string }
 *                               clinicName: { type: string }
 *                               labName: { type: string }
 *                               emailId: { type: string }
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             fileName: { type: string }
 *                             fileUrl: { type: string }
 *                             fileType: { type: string }
 *                             fileSize: { type: number }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 *                     hasNext: { type: boolean }
 *                     hasPrev: { type: boolean }
 */
router.get('/', listHistoryValidation, listHistory);

export const supportTicketHistoryRoutes = router;
