import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { AppointmentService } from './appointment.service';
import {
  createAppointmentSchema,
  appointmentIdParamSchema,
  listAppointmentsQuerySchema,
  rescheduleAppointmentSchema,
  cancelAppointmentSchema,
} from './appointment.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';

const appointmentService = new AppointmentService();

export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const appointment = await appointmentService.create(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
}

export async function getAppointmentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const appointment = await appointmentService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
}

export async function listAppointments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const filters = {
        doctorId: req.query.doctorId,
        userId: req.query.userId,
        status: req.query.status,
        date: req.query.date,
        timeframe: req.query.timeframe,
        isReviewAdded: req.query.isReviewAdded !== undefined ? req.query.isReviewAdded === 'true' : undefined,
    };
    const result = await appointmentService.list(page, limit, filters);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function rescheduleAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const input = { ...req.body };

    // Auto-populate rescheduledBy fields if not provided
    if (!input.rescheduledById && authReq.userId) {
      input.rescheduledById = authReq.userId;
    }
    if (!input.rescheduledByRole && authReq.userType) {
      // Map 'clinic' to 'doctor' for the API enum
      const typeMap: Record<string, string> = { clinic: 'doctor' };
      input.rescheduledByRole = typeMap[authReq.userType] || authReq.userType;
    }

    const appointment = await appointmentService.reschedule(req.params.id, input, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: appointment });
  } catch (err) {
    // Enhanced logging for debugging 500 errors
    console.error('Reschedule Error:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
    next(err);
  }
}

export async function cancelAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const appointment = await appointmentService.cancel(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
}

export async function deleteAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await appointmentService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createAppointmentValidation = [validateBody(createAppointmentSchema)];
export const getAppointmentByIdValidation = [validateParams(appointmentIdParamSchema)];
export const listAppointmentsValidation = [validateQuery(listAppointmentsQuerySchema)];
export const rescheduleAppointmentValidation = [
  validateParams(appointmentIdParamSchema),
  validateBody(rescheduleAppointmentSchema),
];
export const cancelAppointmentValidation = [
  validateParams(appointmentIdParamSchema),
  validateBody(cancelAppointmentSchema),
];
export const deleteAppointmentValidation = [validateParams(appointmentIdParamSchema)];
