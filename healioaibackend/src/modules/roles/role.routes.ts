import { Router } from 'express';
import {
  createRole,
  getRoleById,
  listRoles,
  updateRole,
  deleteRole,
  createRoleValidation,
  getRoleByIdValidation,
  listRolesValidation,
  updateRoleValidation,
  deleteRoleValidation,
} from './role.controller';

const router = Router();

/**
 * @openapi
 * /roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               permissions: { type: array, items: { type: string } }
 *               isSystemRole: { type: boolean }
 *     responses:
 *       201: { description: Role created }
 *       400: { description: Validation error }
 *       409: { description: Role name already exists }
 */
router.post('/', createRoleValidation, createRole);

/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: List roles (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list of roles }
 */
router.get('/', listRolesValidation, listRoles);

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     tags: [Roles]
 *     summary: Get role by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Role found }
 *       404: { description: Role not found }
 */
router.get('/:id', getRoleByIdValidation, getRoleById);

/**
 * @openapi
 * /roles/{id}:
 *   patch:
 *     tags: [Roles]
 *     summary: Update role
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
 *               name: { type: string }
 *               description: { type: string }
 *               permissions: { type: array }
 *     responses:
 *       200: { description: Role updated }
 *       404: { description: Role not found }
 */
router.patch('/:id', updateRoleValidation, updateRole);

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete role (system roles cannot be deleted)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Role deleted }
 *       400: { description: Cannot delete system role }
 *       404: { description: Role not found }
 */
router.delete('/:id', deleteRoleValidation, deleteRole);

export const roleRoutes = router;
