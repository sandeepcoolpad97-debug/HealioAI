import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { AppointmentRepository } from './appointment.repository';
import { IAppointment } from './appointment.model';
import {
  CreateAppointmentInput,
  RescheduleAppointmentInput,
  CancelAppointmentInput,
} from './appointment.validation';
import { FilterQuery } from 'mongoose';

export class AppointmentService {
  private readonly appointmentRepository = new AppointmentRepository();

  async create(data: CreateAppointmentInput, actorId?: string): Promise<IAppointment> {
    const now = new Date();
    const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const lastId = await this.appointmentRepository.findLastAppointmentId(datePrefix);
    
    let sequenceNumber = 1;
    if (lastId) {
        const parts = lastId.split('-');
        if (parts.length === 3) {
            sequenceNumber = parseInt(parts[2], 10) + 1;
        }
    }

    const appointmentId = `APT-${datePrefix}-${sequenceNumber.toString().padStart(4, '0')}`;

    const payload = {
      ...data,
      appointmentId,
      bookingStatus: 'confirmed',
      createdBy: actorId || 'system',
      updatedBy: actorId || 'system',
    };

    return this.appointmentRepository.create(payload as unknown as Partial<IAppointment>);
  }

  async getById(id: string): Promise<IAppointment> {
    const appointment = await this.appointmentRepository.findByIdWithRefs(id);
    if (!appointment) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Appointment not found'
      );
    }
    return appointment;
  }

  async list(page: number, limit: number, filters: any = {}): Promise<PaginatedResult<IAppointment>> {
    const query: FilterQuery<IAppointment> = {};

    if (filters.doctorId) query.doctorId = filters.doctorId;
    if (filters.userId) query.userId = filters.userId;
    if (filters.status) query.bookingStatus = filters.status;
    if (filters.date) {
      const date = new Date(filters.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.currentStartAt = { $gte: date, $lt: nextDay };
    }

    if (filters.timeframe) {
      const now = new Date();
      if (filters.timeframe === 'upcoming') {
        // If query.currentStartAt already exists (from date filter), merge criteria
        // but typically date filter + timeframe 'upcoming' might be redundant or specific.
        // Assuming user wants upcoming from NOW.
        // To be safe, if date is set, we respect it as the primary range,
        // but if timeframe is set without specific date, we use it.
        // If both are present, we can use $and or simply intersect.
        // For simplicity: specific date overrides timeframe if present, OR we intersect.
        // Let's do intersection if 'date' is not present, otherwise respect 'date' only?
        // Actually, "upcoming" usually means "from now onwards".
        // "past" means "before now".
        if (!query.currentStartAt) {
             query.currentStartAt = { $gte: now };
        } else {
             // If date range is set, we just ensure it respects "now" boundary if needed?
             // E.g. date=2025-01-01 and timeframe=upcoming.
             // If 2025-01-01 is future, fine.
             // Let's assume timeframe is used when date is NOT provided for general lists.
             // If user provides both, let's treat 'date' as precise filter and ignore timeframe or apply logical AND.
             // Let's apply logical AND via $gte/$lt merge if possible, or simpler:
             // If date is provided, timeframe is likely irrelevant or implicit.
             // Let's only apply timeframe if date is NOT provided to avoid conflict.
             // User instruction says "get appointments based on the upcoming or past".
        }
      } else if (filters.timeframe === 'past') {
         if (!query.currentStartAt) {
             query.currentStartAt = { $lt: now };
         }
      }
    }

    return this.appointmentRepository.findPaginatedWithRefs(query, page, limit);
  }

  async reschedule(id: string, data: RescheduleAppointmentInput, actorId?: string): Promise<IAppointment> {
    const appointment = await this.getById(id);

    if (appointment.bookingStatus === 'cancelled') {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Cannot reschedule a cancelled appointment'
      );
    }

    if (data.newStartAt.getTime() === appointment.currentStartAt.getTime()) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'New time must be different from current time'
      );
    }

    const roleMap: Record<string, string> = {
      user: 'User',
      doctor: 'Clinic',
      lab: 'Lab',
      admin: 'Admin'
    };
    const roleKey = data.rescheduledByRole || 'admin';
    const modelName = roleMap[roleKey] || 'Admin';

    // Use the explicitly provided ID from the request body if available, 
    // otherwise fallback to actorId (authenticated user)
    const rescheduledById = data.rescheduledById || actorId;

    const updatePayload: any = {
      bookingStatus: 'rescheduled',
      updatedBy: actorId || 'system',
      currentStartAt: data.newStartAt,
      $inc: { rescheduleCount: 1 },
      $push: {
        appointmentInfo: {
          startAt: data.newStartAt,
          action: 'rescheduled',
          notes: data.reason,
          symptoms: data.symptoms || [],
          category: data.rescheduleCategory || 'patient_request',
          rescheduledByRole: modelName,
          rescheduledById: rescheduledById,
          createdAt: new Date()
        }
      }
    };

    // TODO: Implement notification logic using data.notifyPatient and data.notifyDoctor
    if (data.notifyPatient || data.notifyDoctor) {
        console.log(`[Notification] Reschedule notification requested: Patient=${data.notifyPatient}, Doctor=${data.notifyDoctor}`);
    }

    const updated = await this.appointmentRepository.updateById(id, updatePayload);
    if (!updated) {
      throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Appointment not found');
    }
    return updated;
  }

  async cancel(id: string, data: CancelAppointmentInput, actorId?: string): Promise<IAppointment> {
    const appointment = await this.getById(id);

    if (appointment.bookingStatus === 'cancelled') {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Appointment is already cancelled'
      );
    }

    const updatePayload: any = {
      bookingStatus: 'cancelled',
      cancelledAt: new Date(),
      cancellationNotes: data.reason,
      updatedBy: actorId || 'system',
      $push: {
        appointmentInfo: {
          startAt: appointment.currentStartAt,
          action: 'cancelled',
          notes: data.reason,
          category: data.cancellationCategory || 'patient_cancelled',
          createdAt: new Date()
        }
      }
    };

    // TODO: Implement refund logic if data.requestRefund is true
    // TODO: Implement notification logic using data.notifyPatient and data.notifyDoctor

    const updated = await this.appointmentRepository.updateById(id, updatePayload);
    if (!updated) {
      throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Appointment not found');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.appointmentRepository.deleteById(id);
    if (!deleted) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Appointment not found'
      );
    }
  }
}
