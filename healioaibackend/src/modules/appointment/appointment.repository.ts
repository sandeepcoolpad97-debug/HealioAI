import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { getPaginationParams, paginated, PaginatedResult } from '../../common/pagination/pagination';
import { AppointmentModel, IAppointment } from './appointment.model';

const APPOINTMENT_REF_POPULATE = [
  // Updated to use Clinic model fields since Doctor model does not exist
  { path: 'doctorId', select: 'clinicName doctorName emailId contactNumber specialisation' },
  { path: 'userId', select: 'name email phone' },
  { path: 'paymentId', select: 'amount paymentStatus currency paymentSummary transactionId' },
  { path: 'offersApplied', select: 'code description discountType discountValue' }
];

export class AppointmentRepository extends BaseRepository<IAppointment> {
  constructor() {
    super(AppointmentModel);
  }

  async findActiveById(id: string): Promise<IAppointment | null> {
    return this.findOne({
      _id: id,
      // Add any other active checks if necessary
    } as FilterQuery<IAppointment>);
  }

  async findByIdWithRefs(id: string): Promise<IAppointment | null> {
    return this.model
      .findById(id)
      .populate(APPOINTMENT_REF_POPULATE[0])
      .populate(APPOINTMENT_REF_POPULATE[1])
      .populate(APPOINTMENT_REF_POPULATE[2])
      .populate(APPOINTMENT_REF_POPULATE[3])
      .exec() as Promise<IAppointment | null>;
  }

  async findPaginatedWithRefs(
    filter: FilterQuery<IAppointment>,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IAppointment>> {
    const params = getPaginationParams(page, limit);
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .populate(APPOINTMENT_REF_POPULATE[0])
        .populate(APPOINTMENT_REF_POPULATE[1])
        .populate(APPOINTMENT_REF_POPULATE[2])
        .populate(APPOINTMENT_REF_POPULATE[3])
        .sort({ currentStartAt: -1 }) // Default sort by date descending
        .skip(params.skip)
        .limit(params.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return paginated(data as IAppointment[], total, params);
  }

  async findLastAppointmentId(datePrefix: string): Promise<string | null> {
    const regex = new RegExp(`^APT-${datePrefix}-\\d{4}$`);
    const lastAppointment = await this.model
      .findOne({ appointmentId: regex })
      .sort({ appointmentId: -1 })
      .select('appointmentId')
      .exec();
    
    return lastAppointment ? lastAppointment.appointmentId : null;
  }
}
