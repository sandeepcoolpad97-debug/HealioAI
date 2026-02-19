import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  createMedia,
  getMediaById,
  updateMedia,
  deleteMedia,
  createMediaValidation,
  getMediaByIdValidation,
  updateMediaValidation,
  deleteMediaValidation,
} from './media.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

function attachFileToBody(req: Request, _res: Response, next: NextFunction) {
  const anyReq = req as any;
  const file = anyReq.file as any;
  if (file && file.buffer && file.mimetype && !anyReq.body.file) {
    const base64 = file.buffer.toString('base64');
    anyReq.body.file = `data:${file.mimetype};base64,${base64}`;
  }
  const body: any = anyReq.body;
  if (typeof body.tags === 'string') {
    body.tags = [body.tags];
  }
  if (typeof body.context === 'string') {
    try {
      const parsed = JSON.parse(body.context);
      if (parsed && typeof parsed === 'object') {
        body.context = parsed;
      }
    } catch (_err) {
    }
  }
  next();
}

/**
 * @openapi
 * /media:
 *   post:
 *     tags: [Media]
 *     summary: Upload media to Cloudinary and store metadata
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image or file to upload to Cloudinary
 *               folder:
 *                 type: string
 *                 description: Optional Cloudinary folder
 *               ownerType:
 *                 type: string
 *                 description: Logical owner type (e.g. User, Clinic, SupportTicket)
 *               ownerId:
 *                 type: string
 *                 description: MongoDB ObjectId of the owner document
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *               description:
 *                 type: string
 *               context:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     publicId: { type: string }
 *                     url: { type: string }
 *                     secureUrl: { type: string }
 *                     resourceType: { type: string }
 *                     format: { type: string }
 *                     bytes: { type: number }
 *                     width: { type: number }
 *                     height: { type: number }
 *                     folder: { type: string }
 *                     originalFilename: { type: string }
 *                     tags:
 *                       type: array
 *                       items: { type: string }
 *                     context:
 *                       type: object
 *                       additionalProperties: true
 *                     ownerType: { type: string }
 *                     ownerId: { type: string }
 *                     description: { type: string }
 */
router.post('/', upload.single('file'), attachFileToBody, createMediaValidation, createMedia);

/**
 * @openapi
 * /media/{id}:
 *   get:
 *     tags: [Media]
 *     summary: Get media metadata by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     responses:
 *       200:
 *         description: Media found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     publicId: { type: string }
 *                     url: { type: string }
 *                     secureUrl: { type: string }
 *                     resourceType: { type: string }
 *                     format: { type: string }
 *                     bytes: { type: number }
 *                     width: { type: number }
 *                     height: { type: number }
 *                     folder: { type: string }
 *                     originalFilename: { type: string }
 *                     tags:
 *                       type: array
 *                       items: { type: string }
 *                     context:
 *                       type: object
 *                       additionalProperties: true
 *                     ownerType: { type: string }
 *                     ownerId: { type: string }
 *                     description: { type: string }
 *       404:
 *         description: Media not found
 */
router.get('/:id', getMediaByIdValidation, getMediaById);

/**
 * @openapi
 * /media/{id}:
 *   patch:
 *     tags: [Media]
 *     summary: Update media metadata or replace the underlying file
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: New file. Re-uploads to Cloudinary.
 *               folder:
 *                 type: string
 *               ownerType:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items: { type: string }
 *               description:
 *                 type: string
 *               context:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: Media updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: { type: string }
 *                     publicId: { type: string }
 *                     url: { type: string }
 *                     secureUrl: { type: string }
 *                     resourceType: { type: string }
 *                     format: { type: string }
 *                     bytes: { type: number }
 *                     width: { type: number }
 *                     height: { type: number }
 *                     folder: { type: string }
 *                     originalFilename: { type: string }
 *                     tags:
 *                       type: array
 *                       items: { type: string }
 *                     context:
 *                       type: object
 *                       additionalProperties: true
 *                     ownerType: { type: string }
 *                     ownerId: { type: string }
 *                     description: { type: string }
 *       404:
 *         description: Media not found
 */
router.patch(
  '/:id',
  upload.single('file'),
  attachFileToBody,
  updateMediaValidation,
  updateMedia
);

/**
 * @openapi
 * /media/{id}:
 *   delete:
 *     tags: [Media]
 *     summary: Delete media (Cloudinary asset and DB record)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     responses:
 *       204: { description: Media deleted successfully }
 *       404: { description: Media not found }
 */
router.delete('/:id', deleteMediaValidation, deleteMedia);

export const mediaRoutes = router;
