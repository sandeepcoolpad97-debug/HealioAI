import { BaseRepository } from '../../common/repository/base.repository';
import { SlotTrackerModel, ISlotTracker } from './slotTracker.model';

export class SlotTrackerRepository extends BaseRepository<ISlotTracker> {
  constructor() {
    super(SlotTrackerModel);
  }

  async findAvailableSlots(doctorId: string, date: string): Promise<ISlotTracker[]> {
    const now = new Date();
    return this.model.find({
      doctorId,
      date,
      status: 'available',
      // Ensure we don't return slots in the past if today
      slotStartAt: { $gt: now }
    }).sort({ slotStartAt: 1 }).exec();
  }

  async findSlotsByDoctorAndDate(doctorId: string, date: string): Promise<ISlotTracker[]> {
    return this.model.find({
      doctorId,
      date
    }).sort({ slotStartAt: 1 }).exec();
  }

  async bulkCreateSlots(slots: Partial<ISlotTracker>[]): Promise<ISlotTracker[]> {
    return this.model.insertMany(slots) as unknown as Promise<ISlotTracker[]>;
  }

  async findConflictingSlots(doctorId: string, start: Date, end: Date): Promise<ISlotTracker[]> {
    return this.model.find({
      doctorId,
      status: { $ne: 'cancelled' },
      $or: [
        {
            slotStartAt: { $lt: end, $gte: start }
        },
        {
            slotEndAt: { $gt: start, $lte: end }
        }
      ]
    }).exec();
  }
}
