import { Router } from 'express';
import {
  createLab,
  getLabById,
  listLabs,
  updateLab,
  deleteLab,
  loginLab,
  createLabValidation,
  getLabByIdValidation,
  listLabsValidation,
  updateLabValidation,
  deleteLabValidation,
  loginLabValidation,
} from './lab.controller';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /labs/login:
 *   post:
 *     tags: [Labs]
 *     summary: Login lab using Firebase token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firebaseUid, idToken]
 *             properties:
 *               firebaseUid: { type: string }
 *               idToken: { type: string }
 *               email: { type: string, description: "For Google login; use email OR phone" }
 *               phone: { type: object, description: "For mobile login; use email OR phone", properties: { countryCode: { type: string }, number: { type: string } } }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Unauthorized }
 *       404: { description: Lab not found }
 */
router.post('/login', loginLabValidation, loginLab);

/**
 * @openapi
 * /labs:
 *   post:
 *     tags: [Labs]
 *     summary: Create a lab
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firebaseUid, labName, registrationNumber, roleId, contactNumber, consents]
 *             properties:
 *               firebaseUid: { type: string, description: Firebase UID }
 *               labName: { type: string }
 *               registrationNumber: { type: string }
 *               roleId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               address: { type: string, description: Optional address }
 *               contactNumber: { type: string }
 *               emailId: { type: string, format: email }
 *               operatingHours:
 *                 description: Optional array of operating hours per day
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day: { type: string, enum: [Mon, Tue, Wed, Thu, Fri, Sat, Sun] }
 *                     openTime: { type: string }
 *                     closeTime: { type: string }
 *                     isClosed: { type: boolean }
 *               services:
 *                 type: object
 *                 properties:
 *                   testCategories: { type: array, items: { type: string }, description: Array of test category names (any string) }
 *                   homeSampleCollection: { type: boolean }
 *                   reportDeliveryType: { type: array, items: { type: string, enum: [pdf, in_app] } }
 *               consents:
 *                 type: object
 *                 required: [termsAndConditions, policyTerms, medicalDisclaimer]
 *                 properties:
 *                   termsAndConditions: { type: boolean, enum: [true] }
 *                   policyTerms: { type: boolean, enum: [true] }
 *                   medicalDisclaimer: { type: boolean, enum: [true] }
 *     responses:
 *       201: { description: Lab created }
 *       400: { description: Validation error }
 *       409: { description: Registration number or email already exists }
 */
router.post('/', createLabValidation, createLab);

/**
 * @openapi
 * /labs:
 *   get:
 *     tags: [Labs]
 *     summary: List labs (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, default: 20 }
 *     responses:
 *       200: { description: Paginated list of labs }
 */
router.get('/', listLabsValidation, listLabs);

/**
 * @openapi
 * /labs/{id}:
 *   get:
 *     tags: [Labs]
 *     summary: Get lab by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Lab found }
 *       404: { description: Lab not found }
 */
router.get('/:id', authMiddleware, getLabByIdValidation, getLabById);

/**
 * @openapi
 * /labs/{id}:
 *   patch:
 *     tags: [Labs]
 *     summary: Update lab
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               labName: { type: string }
 *               registrationNumber: { type: string }
 *               roleId: { type: string }
 *               address: { type: string }
 *               contactNumber: { type: string }
 *               emailId: { type: string, format: email }
 *               operatingHours: { type: array }
 *               services: { type: object }
 *               consents: { type: object }
 *     responses:
 *       200: { description: Lab updated }
 *       404: { description: Lab not found }
 *       409: { description: Registration number or email already exists }
 */
router.patch('/:id', updateLabValidation, updateLab);

/**
 * @openapi
 * /labs/{id}:
 *   delete:
 *     tags: [Labs]
 *     summary: Delete lab
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Lab deleted }
 *       404: { description: Lab not found }
 */
router.delete('/:id', deleteLabValidation, deleteLab);

export const labRoutes = router;
