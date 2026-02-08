import { Router } from 'express';
import {
  createAppointment,
  getAppointmentById,
  listAppointments,
  deleteAppointment,
  rescheduleAppointment,
  cancelAppointment,
  createAppointmentValidation,
  getAppointmentByIdValidation,
  listAppointmentsValidation,
  deleteAppointmentValidation,
  rescheduleAppointmentValidation,
  cancelAppointmentValidation,
} from './appointment.controller';

const router = Router();

/**
 * @openapi
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Create a new appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [doctorId, userId, paymentId, currentStartAt]
 *             properties:
 *               doctorId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               userId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               paymentId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               currentStartAt: { type: string, format: date-time }
 *               consultationType: { type: string, enum: [online, in_person], default: in_person }
 *               consultationDuration: { type: number, default: 30 }
 *               offersApplied: { type: array, items: { type: string } }
 *               symptoms: { type: array, items: { type: string }, description: List of symptoms }
 *               appointmentInfo:
 *                 type: object
 *                 properties:
 *                   notes: { type: string }
 *     responses:
 *       201: { description: Appointment created successfully }
 *       400: { description: Validation error }
 *       401: { description: Unauthorized }
 */
router.post('/',    createAppointmentValidation, createAppointment);

/**
 * @openapi
 * /appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: List appointments (paginated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, default: 20 }
 *         description: Items per page
 *       - in: query
 *         name: doctorId
 *         schema: { type: string }
 *       - in: query
 *         name: userId
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [confirmed, rescheduled, cancelled] }
 *       - in: query
 *         name: date
 *         schema: { type: string, format: date-time }
 *         description: Filter by date (YYYY-MM-DD or ISO)
 *     responses:
 *       200:
 *         description: Paginated list of appointments
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
router.get('/',    listAppointmentsValidation, listAppointments);

/**
 * @openapi
 * /appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Get appointment by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     responses:
 *       200: { description: Appointment found }
 *       404: { description: Appointment not found }
 */
router.get('/:id',    getAppointmentByIdValidation, getAppointmentById);

/**
 * @openapi
 * /appointments/{id}/reschedule:
 *   post:
 *     tags: [Appointments]
 *     summary: Reschedule an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newStartAt, reason]
 *             properties:
 *               newStartAt: { type: string, format: date-time }
 *               reason: { type: string }
 *               symptoms: { type: array, items: { type: string }, description: Updated list of symptoms }
 *               rescheduleCategory: { type: string, enum: [patient_request, doctor_unavailable, emergency, technical_issue, other], default: patient_request }
 *               rescheduledByRole: { type: string, enum: [user, doctor, lab, admin], description: Defaults to authenticated user role }
 *               rescheduledById: { type: string, description: MongoDB ObjectId (24 hex chars). Defaults to authenticated user ID }
 *               notifyPatient: { type: boolean, default: true }
 *               notifyDoctor: { type: boolean, default: true }
 *     responses:
 *       200: { description: Appointment rescheduled successfully }
 *       400: { description: Validation error }
 *       404: { description: Appointment not found }
 */
router.post('/:id/reschedule',    rescheduleAppointmentValidation, rescheduleAppointment);

/**
 * @openapi
 * /appointments/{id}/cancel:
 *   post:
 *     tags: [Appointments]
 *     summary: Cancel an appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [reason]
 *             properties:
 *               reason: { type: string }
 *               cancellationCategory: { type: string, enum: [patient_cancelled, doctor_cancelled, medical_emergency, duplicate_booking, payment_failed, other], default: patient_cancelled }
 *               requestRefund: { type: boolean, default: false }
 *               notifyPatient: { type: boolean, default: true }
 *               notifyDoctor: { type: boolean, default: true }
 *     responses:
 *       200: { description: Appointment cancelled successfully }
 *       400: { description: Validation error }
 *       404: { description: Appointment not found }
 */
router.post('/:id/cancel',    cancelAppointmentValidation, cancelAppointment);

/**
 * @openapi
 * /appointments/{id}:
 *   delete:
 *     tags: [Appointments]
 *     summary: Delete appointment (hard delete)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     responses:
 *       204: { description: Appointment deleted successfully }
 *       404: { description: Appointment not found }
 */
router.delete('/:id',    deleteAppointmentValidation, deleteAppointment);

export const appointmentRoutes = router;
