import { Router } from 'express';
import {
  onboardUser,
  createUser,
  getUserById,
  listUsers,
  updateUser,
  deleteUser,
  onboardUserValidation,
  createUserValidation,
  getUserByIdValidation,
  listUsersValidation,
  updateUserValidation,
  deleteUserValidation,
} from './user.controller';

const router = Router();

/**
 * @openapi
 * /users/onboard:
 *   post:
 *     tags: [Users]
 *     summary: Onboard a new user (profile, phone, role, subscription, consents)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firebaseUid, name, gender, roleId, subscriptionId, phone, consents]
 *             properties:
 *               firebaseUid: { type: string, description: Firebase UID }
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               age: { type: integer, minimum: 0, maximum: 120 }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string, default: en }
 *               roleId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               subscriptionId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               email: { type: string, format: email, description: Optional; must be unique if provided }
 *               phone:
 *                 type: object
 *                 required: [number]
 *                 properties:
 *                   countryCode: { type: string, default: "+91" }
 *                   number: { type: string }
 *                   verified: { type: boolean, default: false }
 *               consents:
 *                 type: object
 *                 required: [termsAndConditions, policyTerms, medicalDisclaimer]
 *                 properties:
 *                   termsAndConditions: { type: boolean, enum: [true] }
 *                   policyTerms: { type: boolean, enum: [true] }
 *                   medicalDisclaimer: { type: boolean, enum: [true] }
 *               medical:
 *                 type: object
 *                 properties:
 *                   existingConditions: { type: array, items: { type: string } }
 *                   otherConditions: { type: string }
 *     responses:
 *       201: { description: User onboarded successfully }
 *       400: { description: Validation error }
 *       409: { description: Phone number or email address already exists }
 */
router.post('/onboard', onboardUserValidation, onboardUser);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [Users]
 *     summary: Create a user (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firebaseUid, name, gender, roleId, subscriptionId, phone, consents]
 *             properties:
 *               firebaseUid: { type: string, description: Firebase UID }
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               age: { type: integer, minimum: 0, maximum: 120 }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string, default: en }
 *               roleId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               subscriptionId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               email: { type: string, format: email, description: Optional; must be unique if provided }
 *               phone:
 *                 type: object
 *                 required: [number]
 *                 properties:
 *                   countryCode: { type: string, default: "+91" }
 *                   number: { type: string }
 *                   verified: { type: boolean, default: false }
 *               consents:
 *                 type: object
 *                 required: [termsAndConditions, policyTerms, medicalDisclaimer]
 *                 properties:
 *                   termsAndConditions: { type: boolean, enum: [true] }
 *                   policyTerms: { type: boolean, enum: [true] }
 *                   medicalDisclaimer: { type: boolean, enum: [true] }
 *               medical:
 *                 type: object
 *                 properties:
 *                   existingConditions: { type: array, items: { type: string } }
 *                   otherConditions: { type: string }
 *     responses:
 *       201: { description: User created successfully }
 *       400: { description: Validation error }
 *       409: { description: Phone number or email address already exists }
 */
router.post('/', createUserValidation, createUser);

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: List users (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Page number (1-based)
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, default: 20 }
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: { type: string }
 *                       name: { type: string }
 *                       email: { type: string, nullable: true }
 *                       phone: { type: object }
 *                       roleId: { type: object }
 *                       subscriptionId: { type: object }
 *                       subscriptionStatus: { type: string, enum: [active, expired, cancelled, trial] }
 *                       isActive: { type: boolean }
 *                       isDeleted: { type: boolean }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 *                     hasNext: { type: boolean }
 *                     hasPrev: { type: boolean }
 */
router.get('/', listUsersValidation, listUsers);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     responses:
 *       200:
 *         description: User found
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
 *                     name: { type: string }
 *                     email: { type: string, nullable: true }
 *                     phone: { type: object }
 *                     roleId: { type: object }
 *                     subscriptionId: { type: object }
 *                     subscriptionStatus: { type: string, enum: [active, expired, cancelled, trial] }
 *                     isActive: { type: boolean }
 *                     isDeleted: { type: boolean }
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *       404: { description: User not found }
 */
router.get('/:id', getUserByIdValidation, getUserById);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user (all fields optional; at least one required)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               name: { type: string, minLength: 1, maxLength: 200 }
 *               age: { type: integer, minimum: 0, maximum: 120 }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string }
 *               roleId: { type: string }
 *               subscriptionId: { type: string }
 *               subscriptionStatus: { type: string, enum: [active, expired, cancelled, trial] }
 *               email: { type: string, format: email }
 *               phone:
 *                 type: object
 *                 properties:
 *                   countryCode: { type: string }
 *                   number: { type: string }
 *                   verified: { type: boolean }
 *               medical:
 *                 type: object
 *                 properties:
 *                   existingConditions: { type: array, items: { type: string } }
 *                   otherConditions: { type: string }
 *     responses:
 *       200: { description: User updated successfully }
 *       400: { description: Validation error }
 *       404: { description: User not found }
 *       409: { description: Phone number or email address already exists }
 */
router.patch('/:id', updateUserValidation, updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user (soft delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *     responses:
 *       204: { description: User deleted successfully }
 *       404: { description: User not found }
 */
router.delete('/:id', deleteUserValidation, deleteUser);

export const userRoutes = router;
