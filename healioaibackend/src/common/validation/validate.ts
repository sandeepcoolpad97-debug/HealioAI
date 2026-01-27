import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';
import { AppError } from '../errors/app-error';
import { ErrorCode } from '../errors/error-codes';
import { HTTP_STATUS } from '../constants';

type ValidationTarget = 'body' | 'query' | 'params' | 'headers';

export function validate(schema: Schema, target: ValidationTarget = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const value = req[target];
    const { error, value: validated } = schema.validate(value, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((d) => d.message).join('; ');
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
        message,
        { details: error.details }
      );
    }

    req[target] = validated;
    next();
  };
}

export function validateBody(schema: Schema) {
  return validate(schema, 'body');
}

export function validateQuery(schema: Schema) {
  return validate(schema, 'query');
}

export function validateParams(schema: Schema) {
  return validate(schema, 'params');
}
