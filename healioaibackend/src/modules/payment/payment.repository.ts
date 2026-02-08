import { FilterQuery } from 'mongoose';
import { BaseRepository } from '../../common/repository/base.repository';
import { PaymentModel, IPayment } from './payment.model';
import { PaginatedResult, getPaginationParams, paginated } from '../../common/pagination/pagination';

const PAYMENT_REF_POPULATE = [
  { path: 'userId', select: 'name email phone' },
  { path: 'paymentFor.serviceId', select: 'name description' },
];

export class PaymentRepository extends BaseRepository<IPayment> {
  constructor() {
    super(PaymentModel);
  }

  async findByTransactionId(transactionId: string): Promise<IPayment | null> {
    return this.findOne({ transactionId } as FilterQuery<IPayment>);
  }

  async findByOrderId(orderId: string): Promise<IPayment | null> {
    return this.findOne({ orderId } as FilterQuery<IPayment>);
  }

  async findByIdWithRefs(id: string): Promise<IPayment | null> {
    return this.model
      .findById(id)
      .populate(PAYMENT_REF_POPULATE[0])
      // .populate(PAYMENT_REF_POPULATE[1])
      .exec();
  }

  async findPaginatedWithRefs(
    filter: FilterQuery<IPayment>,
    page: number,
    limit: number
  ): Promise<PaginatedResult<IPayment>> {
    const params = getPaginationParams(page, limit);
    const [data, total] = await Promise.all([
      this.model
        .find(filter)
        .populate(PAYMENT_REF_POPULATE[0])
        // .populate(PAYMENT_REF_POPULATE[1]) // Service model might not exist or might need check
        .sort({ createdAt: -1 })
        .skip(params.skip)
        .limit(params.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return paginated(data as IPayment[], total, params);
  }
}
