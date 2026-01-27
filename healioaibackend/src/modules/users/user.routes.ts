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
 *             required: [name, gender, roleId, subscriptionId, phone, consents]
 *             properties:
 *               name: { type: string }
 *               age: { type: integer }
 *               gender: { type: string, enum: [male, female, other] }
 *               language: { type: string }
 *               roleId: { type: string }
 *               subscriptionId: { type: string }
 *               phone: { type: object, properties: { countryCode: { type: string }, number: { type: string } } }
 *               consents: { type: object, properties: { termsAndConditions: { type: boolean }, policyTerms: { type: boolean }, medicalDisclaimer: { type: boolean } } }
 *               medical: { type: object }
 *     responses:
 *       201: { description: User onboarded }
 *       400: { description: Validation error }
 *       409: { description: Phone number already exists }
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
 *             required: [name, gender, roleId, subscriptionId, phone, consents]
 *             properties:
 *               name: { type: string }
 *               phone: { type: object }
 *               roleId: { type: string }
 *               subscriptionId: { type: string }
 *               consents: { type: object }
 *     responses:
 *       201: { description: User created }
 *       400: { description: Validation error }
 *       409: { description: Phone number already exists }
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
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list of users }
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
 *         schema: { type: string }
 *     responses:
 *       200: { description: User found }
 *       404: { description: User not found }
 */
router.get('/:id', getUserByIdValidation, getUserById);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: Update user
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
 *               email: { type: string, format: email }
 *               name: { type: string }
 *     responses:
 *       200: { description: User updated }
 *       404: { description: User not found }
 */
router.patch('/:id', updateUserValidation, updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: User deleted }
 *       404: { description: User not found }
 */
router.delete('/:id', deleteUserValidation, deleteUser);

export const userRoutes = router;
