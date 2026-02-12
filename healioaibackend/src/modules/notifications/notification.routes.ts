import { Router } from 'express';
import {
    createNotification,
    getNotificationById,
    listNotifications,
    markAsRead,
    bulkMarkAsRead,
    getUnreadCount,
    deleteNotification,
    createNotificationValidation,
    getNotificationByIdValidation,
    listNotificationsValidation,
    markAsReadValidation,
    bulkMarkAsReadValidation,
    unreadCountValidation,
    deleteNotificationValidation,
} from './notification.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Notifications
 *   description: User notification management
 */

/**
 * @openapi
 * /notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a new notification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, typeId, title, message]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: MongoDB ObjectId of the user
 *               typeId:
 *                 type: string
 *                 description: MongoDB ObjectId of the notification type
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 example: 'Appointment Confirmed'
 *               message:
 *                 type: string
 *                 maxLength: 1000
 *                 example: 'Your appointment with Dr. Smith is confirmed for tomorrow at 10:00 AM'
 *               action:
 *                 type: object
 *                 properties:
 *                   label: { type: string, nullable: true }
 *                   route: { type: string, nullable: true }
 *                   meta: { type: object }
 *               channels:
 *                 type: object
 *                 properties:
 *                   inApp: { type: boolean, default: true }
 *                   push: { type: boolean, default: true }
 *                   sms: { type: boolean, default: false }
 *               reference:
 *                 type: object
 *                 properties:
 *                   refType:
 *                     type: string
 *                     enum: [Appointment, LabOrder, Payment, Clinic, General]
 *                     default: General
 *                   refId: { type: string, nullable: true }
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/Notification'
 *       400: { description: Validation error }
 */
router.post('/', createNotificationValidation, createNotification);

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: List notifications with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *         description: Filter by user ID
 *       - in: query
 *         name: isRead
 *         schema: { type: boolean }
 *         description: Filter by read status
 *       - in: query
 *         name: refType
 *         schema: { type: string, enum: [Appointment, LabOrder, Payment, Clinic, General] }
 *         description: Filter by reference type
 *       - in: query
 *         name: refId
 *         schema: { type: string }
 *         description: Filter by reference ID
 *     responses:
 *       200:
 *         description: Paginated list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Notification' } }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 */
router.get('/', listNotificationsValidation, listNotifications);

/**
 * @openapi
 * /notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count for a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *         description: User ID to get unread count for
 *     responses:
 *       200:
 *         description: Unread count retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     count: { type: integer }
 */
router.get('/unread-count', unreadCountValidation, getUnreadCount);

/**
 * @openapi
 * /notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get notification by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       200:
 *         description: Notification found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Notification' }
 *       404: { description: Notification not found }
 */
router.get('/:id', getNotificationByIdValidation, getNotificationById);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark notification as read
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Notification' }
 *       404: { description: Notification not found }
 *       403: { description: Forbidden - notification belongs to another user }
 */
router.patch('/:id/read', markAsReadValidation, markAsRead);

/**
 * @openapi
 * /notifications/bulk-read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Bulk mark notifications as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [notificationIds]
 *             properties:
 *               notificationIds:
 *                 type: array
 *                 items: { type: string }
 *                 description: Array of notification IDs to mark as read
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     modifiedCount: { type: integer }
 */
router.patch('/bulk-read', bulkMarkAsReadValidation, bulkMarkAsRead);

/**
 * @openapi
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete notification (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       204: { description: Notification deleted }
 *       404: { description: Notification not found }
 */
router.delete('/:id', deleteNotificationValidation, deleteNotification);

/**
 * @openapi
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id: { type: string, description: MongoDB ObjectId }
 *         userId: { type: string, description: User ID }
 *         typeId: { type: string, description: Notification type ID }
 *         title: { type: string }
 *         message: { type: string }
 *         action:
 *           type: object
 *           properties:
 *             label: { type: string }
 *             route: { type: string }
 *             meta: { type: object }
 *         isRead: { type: boolean }
 *         readAt: { type: string, format: date-time, nullable: true }
 *         channels:
 *           type: object
 *           properties:
 *             inApp: { type: boolean }
 *             push: { type: boolean }
 *             sms: { type: boolean }
 *         pushStatus: { type: string, enum: [pending, sent, failed, skipped] }
 *         pushSentAt: { type: string, format: date-time, nullable: true }
 *         pushError: { type: string, nullable: true }
 *         reference:
 *           type: object
 *           properties:
 *             refType: { type: string, enum: [Appointment, LabOrder, Payment, Clinic, General] }
 *             refId: { type: string, nullable: true }
 *         isDeleted: { type: boolean }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *         createdBy: { type: string, description: User ID }
 *         updatedBy: { type: string, description: User ID }
 */

export const notificationRoutes = router;
