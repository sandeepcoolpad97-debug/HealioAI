import { Router } from 'express';
import {
  onboardAdmin,
  createAdmin,
  getAdminById,
  listAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  onboardAdminValidation,
  createAdminValidation,
  getAdminByIdValidation,
  listAdminsValidation,
  updateAdminValidation,
  deleteAdminValidation,
  loginAdminValidation,
} from './admin.controller';
import { authMiddleware } from '../../common/middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /admins/login:
 *   post:
 *     tags: [Admins]
 *     summary: Login admin using Firebase token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firebaseUid, email, idToken]
 *             properties:
 *               firebaseUid: { type: string }
 *               email: { type: string }
 *               idToken: { type: string }
 *     responses:
 *       200: { description: Login successful }
 *       401: { description: Unauthorized }
 *       404: { description: Admin not found }
 */
router.post('/login', loginAdminValidation, loginAdmin);

/**
 * @openapi
 * /admins/onboard:
 *   post:
 *     tags: [Admins]
 *     summary: Onboard a new admin (profile, phone, role, consents)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firebaseUid, name, gender, roleId, email, phone, consents]
 *             properties:
 *               firebaseUid: { type: string, description: Firebase UID }
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string, default: en }
 *               roleId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               email: { type: string, format: email, description: Must be unique }
 *               address: { type: string }
 *               phone:
 *                 type: object
 *                 required: [number]
 *                 properties:
 *                   countryCode: { type: string, default: "+91" }
 *                   number: { type: string }
 *                   verified: { type: boolean, default: false }
 *               consents:
 *                 type: object
 *                 required: [termsAndConditions, policyTerms]
 *                 properties:
 *                   termsAndConditions: { type: boolean, enum: [true] }
 *                   policyTerms: { type: boolean, enum: [true] }
 *     responses:
 *       201: { description: Admin onboarded successfully }
 *       400: { description: Validation error }
 *       409: { description: Phone number or email address already exists }
 */
router.post('/onboard', onboardAdminValidation, onboardAdmin);

/**
 * @openapi
 * /admins:
 *   post:
 *     tags: [Admins]
 *     summary: Create an admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, gender, roleId, email, phone, consents]
 *             properties:
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string, default: en }
 *               roleId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               email: { type: string, format: email, description: Must be unique }
 *               address: { type: string }
 *               phone:
 *                 type: object
 *                 required: [number]
 *                 properties:
 *                   countryCode: { type: string, default: "+91" }
 *                   number: { type: string }
 *                   verified: { type: boolean, default: false }
 *               consents:
 *                 type: object
 *                 required: [termsAndConditions, policyTerms]
 *                 properties:
 *                   termsAndConditions: { type: boolean, enum: [true] }
 *                   policyTerms: { type: boolean, enum: [true] }
 *     responses:
 *       201: { description: Admin created successfully }
 *       400: { description: Validation error }
 *       409: { description: Phone number or email address already exists }
 */
router.post('/', authMiddleware, createAdminValidation, createAdmin);

/**
 * @openapi
 * /admins:
 *   get:
 *     tags: [Admins]
 *     summary: List admins with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list of admins }
 */
router.get('/', authMiddleware, listAdminsValidation, listAdmins);

/**
 * @openapi
 * /admins/{id}:
 *   get:
 *     tags: [Admins]
 *     summary: Get admin by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       200: { description: Admin found }
 *       404: { description: Admin not found }
 */
router.get('/:id', authMiddleware, getAdminByIdValidation, getAdminById);

/**
 * @openapi
 * /admins/{id}:
 *   patch:
 *     tags: [Admins]
 *     summary: Update admin details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string }
 *               roleId: { type: string }
 *               email: { type: string, format: email }
 *               address: { type: string }
 *               phone:
 *                 type: object
 *                 properties:
 *                   countryCode: { type: string }
 *                   number: { type: string }
 *                   verified: { type: boolean }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: Admin updated }
 *       404: { description: Admin not found }
 */
router.patch('/:id', authMiddleware, updateAdminValidation, updateAdmin);

/**
 * @openapi
 * /admins/{id}:
 *   delete:
 *     tags: [Admins]
 *     summary: Soft delete admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       200: { description: Admin deleted }
 *       404: { description: Admin not found }
 */
router.delete('/:id', authMiddleware, deleteAdminValidation, deleteAdmin);

export const adminRoutes = router;
