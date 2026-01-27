import Joi from 'joi';
import { DEFAULT_PAGINATION } from '../constants';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function getPaginationParams(
  page: number = DEFAULT_PAGINATION.PAGE,
  limit: number = DEFAULT_PAGINATION.LIMIT
): PaginationParams {
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.min(
    Math.max(1, Math.floor(limit)),
    DEFAULT_PAGINATION.MAX_LIMIT
  );
  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
}

export function paginated<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit);
  return {
    data,
    meta: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(DEFAULT_PAGINATION.PAGE),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(DEFAULT_PAGINATION.MAX_LIMIT)
    .default(DEFAULT_PAGINATION.LIMIT),
});
