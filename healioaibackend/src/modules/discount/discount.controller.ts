import { Request, Response, NextFunction } from 'express';
import { DiscountService } from './discount.service';
import { HTTP_STATUS } from '../../common/constants';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';

export class DiscountController {
  private discountService: DiscountService;

  constructor() {
    this.discountService = new DiscountService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const discount = await this.discountService.create({
        ...req.body,
        createdBy: authReq.userId!,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: discount,
        message: 'Discount created successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const search = req.query.search as string;
      const serviceId = req.query.serviceId as string;

      const result = await this.discountService.list(page, limit, { isActive, search, serviceId });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: 'Discounts retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const discount = await this.discountService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: discount,
        message: 'Discount retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const discount = await this.discountService.update(req.params.id, {
        ...req.body,
        updatedBy: authReq.userId!,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: discount,
        message: 'Discount updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      await this.discountService.delete(req.params.id, authReq.userId!);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: null,
        message: 'Discount deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
