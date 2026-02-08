import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  listCategoriesQuerySchema,
} from './category.validation';
import { validateBody, validateParams, validateQuery } from '../../common/validation/validate';
import { HTTP_STATUS } from '../../common/constants';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';

const categoryService = new CategoryService();

export async function createCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const category = await categoryService.create(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const category = await categoryService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function listCategories(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
    const search = req.query.search as string;

    const result = await categoryService.list(page, limit, { isActive, search });
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const category = await categoryService.update(req.params.id, req.body, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await categoryService.delete(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export const createCategoryValidation = [validateBody(createCategorySchema)];
export const getCategoryByIdValidation = [validateParams(categoryIdParamSchema)];
export const listCategoriesValidation = [validateQuery(listCategoriesQuerySchema)];
export const updateCategoryValidation = [
  validateParams(categoryIdParamSchema),
  validateBody(updateCategorySchema),
];
export const deleteCategoryValidation = [validateParams(categoryIdParamSchema)];
