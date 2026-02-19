import { Router } from 'express';
import {
    createTicket,
    getTicketById,
    getTicketByTicketId,
    listTickets,
    updateTicket,
    updateStatus,
    assignTicket,
    updatePriority,
    addReply,
    deleteTicket,
    createTicketValidation,
    getTicketByIdValidation,
    getTicketByTicketIdValidation,
    listTicketsValidation,
    updateTicketValidation,
    updateStatusValidation,
    assignTicketValidation,
    updatePriorityValidation,
    addReplyValidation,
    deleteTicketValidation,
} from './supportTicket.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: SupportTickets
 *   description: Support ticket management
 */

/**
 * @openapi
 * /support-tickets:
 *   post:
 *     tags: [SupportTickets]
 *     summary: Create a new support ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [raisedByRole, raisedById, subject, description, category, subCategory]
 *             properties:
 *               raisedByRole: { type: string, enum: [User, Clinic, Lab, Admin] }
 *               raisedById:
 *                 type: string
 *                 description: MongoDB ObjectId of the user/clinic/lab/admin who raised the ticket
 *               subject: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               subCategory: { type: string }
 *               priority: { type: string, enum: [low, medium, high, urgent], default: medium }
 *               reference:
 *                 type: object
 *                 description: Optional linked entity for ticket context
 *                 properties:
 *                   refType:
 *                     type: string
 *                     enum: [Appointment, Payment, LabOrder, Prescription, General]
 *                     default: General
 *                   refId:
 *                     type: string
 *                     nullable: true
 *                     description: MongoDB ObjectId of the linked entity or null
 *               attachments:
 *                 type: array
 *                 description: List of media attachment IDs
 *                 items:
 *                   type: string
 *                   description: Media document ID
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Support ticket with populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.post('/', createTicketValidation, createTicket);

/**
 * @openapi
 * /support-tickets:
 *   get:
 *     tags: [SupportTickets]
 *     summary: List support tickets with filters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: raisedById
 *         schema: { type: string }
 *       - in: query
 *         name: raisedByRole
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [open, in_progress, closed] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high, urgent] }
 *       - in: query
 *         name: assignedToId
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
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
 *                     description: Support ticket with populated references
 *                     properties:
 *                       _id: { type: string }
 *                       ticketId: { type: string }
 *                       raisedById:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           _id: { type: string }
 *                           name: { type: string }
 *                           email: { type: string }
 *                           phone: { type: string }
 *                           clinicName: { type: string }
 *                           labName: { type: string }
 *                           emailId: { type: string }
 *                       assignedToId:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           _id: { type: string }
 *                           name: { type: string }
 *                           email: { type: string }
 *                       subject: { type: string }
 *                       description: { type: string }
 *                       category: { type: string }
 *                       subCategory: { type: string }
 *                       priority: { type: string }
 *                       status: { type: string }
 *                       reference: { type: object }
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
router.get('/', listTicketsValidation, listTickets);

/**
 * @openapi
 * /support-tickets/ticket/{ticketId}:
 *   get:
 *     tags: [SupportTickets]
 *     summary: Get ticket by ticket ID (SUP-xxxxx)
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema: { type: string, pattern: '^SUP-\d{5}$' }
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Support ticket with populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.get('/ticket/:ticketId', getTicketByTicketIdValidation, getTicketByTicketId);

/**
 * @openapi
 * /support-tickets/{id}:
 *   get:
 *     tags: [SupportTickets]
 *     summary: Get ticket by MongoDB ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Support ticket with populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.get('/:id', getTicketByIdValidation, getTicketById);

/**
 * @openapi
 * /support-tickets/{id}:
 *   patch:
 *     tags: [SupportTickets]
 *     summary: Update ticket details
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
 *             properties:
 *               subject: { type: string }
 *               description: { type: string }
 *               category: { type: string }
 *               subCategory: { type: string }
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Updated support ticket with populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.patch('/:id', updateTicketValidation, updateTicket);

/**
 * @openapi
 * /support-tickets/{id}/status:
 *   patch:
 *     tags: [SupportTickets]
 *     summary: Update ticket status
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
 *             required: [status, performedByRole, performedById]
 *             properties:
 *               status: { type: string, enum: [open, in_progress, closed] }
 *               performedByRole: { type: string }
 *               performedById: { type: string }
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Support ticket with updated status and populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.patch('/:id/status', updateStatusValidation, updateStatus);

/**
 * @openapi
 * /support-tickets/{id}/assign:
 *   patch:
 *     tags: [SupportTickets]
 *     summary: Assign ticket to agent
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
 *             required: [assignedToRole, assignedToId, performedByRole, performedById]
 *             properties:
 *               assignedToRole: { type: string, enum: [Admin, SupportAgent] }
 *               assignedToId: { type: string }
 *               performedByRole: { type: string }
 *               performedById: { type: string }
 *     responses:
 *       200:
 *         description: Ticket assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Support ticket with updated assignee and populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.patch('/:id/assign', assignTicketValidation, assignTicket);

/**
 * @openapi
 * /support-tickets/{id}/priority:
 *   patch:
 *     tags: [SupportTickets]
 *     summary: Update ticket priority
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
 *             required: [priority, performedByRole, performedById]
 *             properties:
 *               priority: { type: string, enum: [low, medium, high, urgent] }
 *               performedByRole: { type: string }
 *               performedById: { type: string }
 *     responses:
 *       200:
 *         description: Priority updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   description: Support ticket with updated priority and populated references
 *                   properties:
 *                     _id: { type: string }
 *                     ticketId: { type: string }
 *                     raisedById:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         clinicName: { type: string }
 *                         labName: { type: string }
 *                         emailId: { type: string }
 *                     assignedToId:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         _id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                     subject: { type: string }
 *                     description: { type: string }
 *                     category: { type: string }
 *                     subCategory: { type: string }
 *                     priority: { type: string }
 *                     status: { type: string }
 *                     reference: { type: object }
 */
router.patch('/:id/priority', updatePriorityValidation, updatePriority);

/**
 * @openapi
 * /support-tickets/{id}/reply:
 *   post:
 *     tags: [SupportTickets]
 *     summary: Add a reply to the ticket
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
 *             required: [message, performedByRole, performedById]
 *             properties:
 *               message: { type: string }
 *               performedByRole: { type: string }
 *               performedById: { type: string }
 *               attachments:
 *                 type: array
 *                 description: List of media attachment IDs
 *                 items:
 *                   type: string
 *                   description: Media document ID
 *     responses:
 *       200:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 */
router.post('/:id/reply', addReplyValidation, addReply);

/**
 * @openapi
 * /support-tickets/{id}:
 *   delete:
 *     tags: [SupportTickets]
 *     summary: Delete a support ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Ticket deleted successfully }
 */
router.delete('/:id', deleteTicketValidation, deleteTicket);

export const supportTicketRoutes = router;
