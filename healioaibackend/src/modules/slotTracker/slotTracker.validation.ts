import Joi from 'joi';

export const generateSlotsSchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
    'string.pattern.base': 'Date must be in YYYY-MM-DD format'
  }),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'Start time must be in HH:MM format'
  }),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'End time must be in HH:MM format'
  }),
  durationMinutes: Joi.number().valid(30).default(30)
});

export const getSlotsQuerySchema = Joi.object({
  doctorId: Joi.string().hex().length(24).required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
  status: Joi.string().valid('available', 'locked', 'booked', 'cancelled').optional()
});

export const slotIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
});

export type GenerateSlotsInput = {
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
};
