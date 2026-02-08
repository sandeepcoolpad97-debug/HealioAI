import { FilterQuery } from 'mongoose';
import { AppError } from '../../common/errors/app-error';
import { ErrorCode } from '../../common/errors/error-codes';
import { HTTP_STATUS } from '../../common/constants';
import { PaginatedResult } from '../../common/pagination/pagination';
import { PaymentRepository } from './payment.repository';
import { IPayment } from './payment.model';
import { CreatePaymentInput, UpdatePaymentStatusInput, InitiateRefundInput } from './payment.validation';

export class PaymentService {
  private readonly paymentRepository = new PaymentRepository();

  async create(data: CreatePaymentInput): Promise<IPayment> {
    // If transactionId is provided, check for duplicates
    if (data.transactionId) {
      const existing = await this.paymentRepository.findByTransactionId(data.transactionId);
      if (existing) {
        throw new AppError(
          ErrorCode.CONFLICT,
          HTTP_STATUS.CONFLICT,
          'Payment with this transaction ID already exists'
        );
      }
    }

    const payload = {
      ...data,
      statusHistory: [
        {
          status: data.paymentStatus || 'pending',
          at: new Date(),
        },
      ],
    };

    return this.paymentRepository.create(payload as unknown as Partial<IPayment>);
  }

  async getById(id: string): Promise<IPayment> {
    const payment = await this.paymentRepository.findByIdWithRefs(id);
    if (!payment) {
      throw new AppError(
        ErrorCode.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND,
        'Payment not found'
      );
    }
    return payment;
  }

  async list(page: number, limit: number, filters: any = {}): Promise<PaginatedResult<IPayment>> {
    const query: FilterQuery<IPayment> = {};

    if (filters.userId) query.userId = filters.userId;
    if (filters.status) query.paymentStatus = filters.status;
    if (filters.provider) query.provider = filters.provider;
    
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    return this.paymentRepository.findPaginatedWithRefs(query, page, limit);
  }

  async updateStatus(id: string, data: UpdatePaymentStatusInput): Promise<IPayment> {
    await this.getById(id);

    const update: any = {
      paymentStatus: data.paymentStatus,
      $push: {
        statusHistory: {
          status: data.paymentStatus,
          at: new Date(),
        },
      },
    };

    if (data.paymentStatus === 'paid') {
      update.paidAt = new Date();
    } else if (data.paymentStatus === 'failed') {
      update.failedAt = new Date();
      if (data.failureReason) {
        update.failureReason = data.failureReason;
      }
    }

    if (data.transactionId) {
      update.transactionId = data.transactionId;
    }

    const updatedPayment = await this.paymentRepository.updateById(id, update);
    if (!updatedPayment) {
        throw new AppError(
            ErrorCode.INTERNAL_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Failed to update payment status'
        );
    }
    return updatedPayment;
  }

  async initiateRefund(id: string, data: InitiateRefundInput): Promise<IPayment> {
    const payment = await this.getById(id);

    if (payment.paymentStatus !== 'paid' && payment.paymentStatus !== 'partial_refunded') {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Cannot refund a payment that is not paid'
      );
    }

    if (payment.paymentSummary.totalPayable < (payment.paymentSummary.refundedAmount || 0) + data.amount) {
      throw new AppError(
        ErrorCode.BAD_REQUEST,
        HTTP_STATUS.BAD_REQUEST,
        'Refund amount exceeds refundable amount'
      );
    }

    const refundEntry = {
      refundId: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock refund ID
      amount: data.amount,
      status: 'initiated',
      reason: data.reason,
      initiatedAt: new Date(),
    };

    const update: any = {
      paymentStatus: 'refund_initiated',
      $push: {
        refunds: refundEntry,
        statusHistory: {
          status: 'refund_initiated',
          at: new Date(),
        },
      },
    };

    const updatedPayment = await this.paymentRepository.updateById(id, update);
     if (!updatedPayment) {
        throw new AppError(
            ErrorCode.INTERNAL_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            'Failed to initiate refund'
        );
    }
    return updatedPayment;
  }
}
