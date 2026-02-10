import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';
import { SlotTrackerService } from './slotTracker.service';
import { HTTP_STATUS } from '../../common/constants';

const slotTrackerService = new SlotTrackerService();

export async function generateSlots(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    // Ideally check if user is admin or the doctor themselves
    const slots = await slotTrackerService.generateSlots(req.body, authReq.userId);
    res.status(HTTP_STATUS.CREATED).json({ success: true, count: slots.length, data: slots });
  } catch (err) {
    next(err);
  }
}

export async function getSlots(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { doctorId, date } = req.query as { doctorId: string; date: string };
    const slots = await slotTrackerService.getSlots(doctorId, date);
    res.status(HTTP_STATUS.OK).json({ success: true, data: slots });
  } catch (err) {
    next(err);
  }
}

export async function lockSlot(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userId) {
        throw new Error("User ID is missing from authenticated request");
    }
    const slot = await slotTrackerService.lockSlot(req.params.id, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: slot });
  } catch (err) {
    next(err);
  }
}

export async function unlockSlot(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.userId) {
        throw new Error("User ID is missing from authenticated request");
    }
    const slot = await slotTrackerService.unlockSlot(req.params.id, authReq.userId);
    res.status(HTTP_STATUS.OK).json({ success: true, data: slot });
  } catch (err) {
    next(err);
  }
}
