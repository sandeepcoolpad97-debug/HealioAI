import { Request, Response, NextFunction } from 'express';
import { ServiceService } from './service.service';
import { HTTP_STATUS } from '../../common/constants';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';

export class ServiceController {
  private serviceService: ServiceService;

  constructor() {
    this.serviceService = new ServiceService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const service = await this.serviceService.create({
        ...req.body,
        createdBy: authReq.userId!,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: service,
        message: 'Service created successfully'
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

      const result = await this.serviceService.list(page, limit, { isActive, search });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result,
        message: 'Services retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const service = await this.serviceService.getById(req.params.id);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: service,
        message: 'Service retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      const service = await this.serviceService.update(req.params.id, {
        ...req.body,
        updatedBy: authReq.userId!,
      });
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: service,
        message: 'Service updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authReq = req as AuthenticatedRequest;
      await this.serviceService.delete(req.params.id, authReq.userId!);
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: null,
        message: 'Service deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}
