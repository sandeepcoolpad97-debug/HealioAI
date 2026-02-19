import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { SlotTrackerRepository } from './slotTracker.repository';
import { ISlotTracker } from './slotTracker.model';
import { GenerateSlotsInput } from './slotTracker.validation';
import mongoose from 'mongoose';

export class SlotTrackerService {
  private readonly slotTrackerRepository = new SlotTrackerRepository();

  async generateSlots(input: GenerateSlotsInput, actorId?: string): Promise<ISlotTracker[]> {
    const { doctorId, date, startTime, endTime, durationMinutes } = input;

    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    // Adjusting date object creation to be robust
    const startDate = new Date(date);
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(endHour, endMinute, 0, 0);

    if (startDate >= endDate) {
        throw new AppError(ErrorCode.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST, 'Start time must be before end time');
    }

    // Check for existing slots to avoid overlap (basic check)
    // For a robust system, we should check specifically for overlaps, but here we might just check if slots exist for this doctor/date
    // Or we can rely on the unique index in the model: { doctorId: 1, slotStartAt: 1 }

    const slotsToCreate: Partial<ISlotTracker>[] = [];
    let currentSlotStart = new Date(startDate);

    while (currentSlotStart < endDate) {
        const currentSlotEnd = new Date(currentSlotStart);
        currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + durationMinutes);

        if (currentSlotEnd > endDate) {
            break; // Don't create a partial slot at the end
        }

        slotsToCreate.push({
            doctorId: new mongoose.Types.ObjectId(doctorId),
            date,
            slotStartAt: new Date(currentSlotStart),
            slotEndAt: new Date(currentSlotEnd),
            durationMinutes: 30, // enforced by model
            status: 'available',
            createdBy: actorId || 'system',
            updatedBy: actorId || 'system'
        });

        currentSlotStart = currentSlotEnd;
    }

    // Use insertMany, likely need to handle duplicates if re-generating
    // If we want to skip duplicates, we might need a different approach or catch errors
    try {
        return await this.slotTrackerRepository.bulkCreateSlots(slotsToCreate);
    } catch (error: any) {
        if (error.code === 11000) {
             throw new AppError(ErrorCode.CONFLICT, HTTP_STATUS.CONFLICT, 'Slots already exist for this time range');
        }
        throw error;
    }
  }

  async getSlots(doctorId: string, date: string): Promise<ISlotTracker[]> {
      return this.slotTrackerRepository.findSlotsByDoctorAndDate(doctorId, date);
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<ISlotTracker[]> {
      return this.slotTrackerRepository.findAvailableSlots(doctorId, date);
  }

  async lockSlot(slotId: string, userId: string): Promise<ISlotTracker> {
      const slot = await this.slotTrackerRepository.findById(slotId);
      if (!slot) {
          throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Slot not found');
      }

      if (slot.status !== 'available') {
          // Check if it's locked but expired
          if (slot.status === 'locked' && slot.lockExpiresAt && slot.lockExpiresAt < new Date()) {
              // Expired lock, proceed to re-lock
          } else {
            throw new AppError(ErrorCode.CONFLICT, HTTP_STATUS.CONFLICT, 'Slot is not available');
          }
      }

      const lockDurationMinutes = 10; // Lock for 10 minutes
      const lockExpiresAt = new Date();
      lockExpiresAt.setMinutes(lockExpiresAt.getMinutes() + lockDurationMinutes);

      return this.slotTrackerRepository.updateById(slotId, {
          status: 'locked',
          lockedByUserId: userId,
          lockExpiresAt
      }) as Promise<ISlotTracker>;
  }

  async unlockSlot(slotId: string, userId: string): Promise<ISlotTracker> {
    const slot = await this.slotTrackerRepository.findById(slotId);
    if (!slot) {
        throw new AppError(ErrorCode.NOT_FOUND, HTTP_STATUS.NOT_FOUND, 'Slot not found');
    }

    if (slot.status !== 'locked') {
        throw new AppError(ErrorCode.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST, 'Slot is not locked');
    }

    if (slot.lockedByUserId?.toString() !== userId) {
         throw new AppError(ErrorCode.FORBIDDEN, HTTP_STATUS.FORBIDDEN, 'You cannot unlock a slot locked by another user');
    }

    return this.slotTrackerRepository.updateById(slotId, {
        status: 'available',
        lockedByUserId: null,
        lockExpiresAt: null
    }) as Promise<ISlotTracker>;
  }
}
