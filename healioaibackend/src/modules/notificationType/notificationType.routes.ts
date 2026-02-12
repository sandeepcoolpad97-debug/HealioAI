import { Router } from 'express';
import {
    createNotificationType,
    getNotificationTypeById,
    getNotificationTypeByKey,
    listNotificationTypes,
    updateNotificationType,
    deleteNotificationType,
    createNotificationTypeValidation,
    getNotificationTypeByIdValidation,
    listNotificationTypesValidation,
    updateNotificationTypeValidation,
    deleteNotificationTypeValidation,
} from './notificationType.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: NotificationTypes
 *   description: Notification type management for defining notification templates
 */

/**
 * @openapi
 * /notification-types:
 *   post:
 *     tags: [NotificationTypes]
 *     summary: Create a new notification type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [key, titleTemplate, messageTemplate]
 *             properties:
 *               key:
 *                 type: string
 *                 maxLength: 100
 *                 description: 'Unique identifier, lowercase alphanumeric with underscores (e.g., appointment_confirmed)'
 *                 example: 'appointment_confirmed'
 *               titleTemplate:
 *                 type: string
 *                 maxLength: 200
 *                 description: 'Notification title template'
 *                 example: 'Appointment Confirmed'
 *               messageTemplate:
 *                 type: string
 *                 maxLength: 1000
 *                 description: 'Notification message template with placeholders (e.g., {{doctorName}})'
 *                 example: 'Your appointment with {{doctorName}} is confirmed for {{appointmentDate}}'
 *               defaultChannels:
 *                 type: object
 *                 properties:
 *                   inApp: { type: boolean, default: true }
 *                   push: { type: boolean, default: true }
 *                   sms: { type: boolean, default: false }
 *               defaultAction:
 *                 type: object
 *                 properties:
 *                   label: { type: string, nullable: true }
 *                   route: { type: string, nullable: true }
 *               icon:
 *                 type: string
 *                 maxLength: 50
 *                 default: 'bell'
 *                 example: 'calendar'
 *               priority:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 default: 3
 *                 description: '1 = high priority, 5 = low priority'
 *     responses:
 *       201:
 *         description: Notification type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/NotificationType'
 *       400: { description: Validation error }
 *       409: { description: Notification type with this key already exists }
 */
router.post('/', createNotificationTypeValidation, createNotificationType);

/**
 * @openapi
 * /notification-types:
 *   get:
 *     tags: [NotificationTypes]
 *     summary: List notification types with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: 'Search in key, title, or message templates'
 *       - in: query
 *         name: priority
 *         schema: { type: integer, minimum: 1, maximum: 5 }
 *     responses:
 *       200:
 *         description: Paginated list of notification types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/NotificationType' } }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 */
router.get('/', listNotificationTypesValidation, listNotificationTypes);

/**
 * @openapi
 * /notification-types/{id}:
 *   get:
 *     tags: [NotificationTypes]
 *     summary: Get notification type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       200:
 *         description: Notification type found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/NotificationType' }
 *       404: { description: Notification type not found }
 */
router.get('/:id', getNotificationTypeByIdValidation, getNotificationTypeById);

/**
 * @openapi
 * /notification-types/key/{key}:
 *   get:
 *     tags: [NotificationTypes]
 *     summary: Get notification type by key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema: { type: string, description: Notification type key }
 *     responses:
 *       200:
 *         description: Notification type found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/NotificationType' }
 *       404: { description: Notification type not found }
 */
router.get('/key/:key', getNotificationTypeByKey);

/**
 * @openapi
 * /notification-types/{id}:
 *   patch:
 *     tags: [NotificationTypes]
 *     summary: Update notification type details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key: { type: string }
 *               titleTemplate: { type: string }
 *               messageTemplate: { type: string }
 *               defaultChannels:
 *                 type: object
 *                 properties:
 *                   inApp: { type: boolean }
 *                   push: { type: boolean }
 *                   sms: { type: boolean }
 *               defaultAction:
 *                 type: object
 *                 properties:
 *                   label: { type: string }
 *                   route: { type: string }
 *               icon: { type: string }
 *               priority: { type: number }
 *     responses:
 *       200:
 *         description: Notification type updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/NotificationType' }
 *       404: { description: Notification type not found }
 *       409: { description: Notification type key conflict }
 */
router.patch('/:id', updateNotificationTypeValidation, updateNotificationType);

/**
 * @openapi
 * /notification-types/{id}:
 *   delete:
 *     tags: [NotificationTypes]
 *     summary: Delete notification type (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       204: { description: Notification type deleted }
 *       404: { description: Notification type not found }
 */
router.delete('/:id', deleteNotificationTypeValidation, deleteNotificationType);

/**
 * @openapi
 * components:
 *   schemas:
 *     NotificationType:
 *       type: object
 *       properties:
 *         _id: { type: string, description: MongoDB ObjectId }
 *         key: { type: string, description: Unique notification type identifier }
 *         titleTemplate: { type: string }
 *         messageTemplate: { type: string }
 *         defaultChannels:
 *           type: object
 *           properties:
 *             inApp: { type: boolean }
 *             push: { type: boolean }
 *             sms: { type: boolean }
 *         defaultAction:
 *           type: object
 *           properties:
 *             label: { type: string }
 *             route: { type: string }
 *         icon: { type: string }
 *         priority: { type: number }
 *         isDeleted: { type: boolean }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *         createdBy: { type: string, description: User ID }
 *         updatedBy: { type: string, description: User ID }
 */

export const notificationTypeRoutes = router;
