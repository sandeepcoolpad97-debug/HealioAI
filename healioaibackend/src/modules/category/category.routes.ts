import { Router } from 'express';
import {
  createCategory,
  getCategoryById,
  listCategories,
  updateCategory,
  deleteCategory,
  createCategoryValidation,
  getCategoryByIdValidation,
  listCategoriesValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
} from './category.controller';

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Categories
 *   description: Category management (Appointment slot categories etc.)
 */

/**
 * @openapi
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, code]
 *             properties:
 *               name: { type: string, maxLength: 100 }
 *               code: { type: string, maxLength: 50, description: 'Unique identifier, lowercase alphanumeric' }
 *               description: { type: string, maxLength: 500 }
 *               isActive: { type: boolean, default: true }
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400: { description: Validation error }
 *       409: { description: Category with this code already exists }
 */
router.post('/',    createCategoryValidation, createCategory);

/**
 * @openapi
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: List categories with pagination and filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated list of categories }
 */
router.get('/',    listCategoriesValidation, listCategories);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       200: { description: Category found }
 *       404: { description: Category not found }
 */
router.get('/:id',    getCategoryByIdValidation, getCategoryById);

/**
 * @openapi
 * /categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Update category details
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
 *               code: { type: string }
 *               description: { type: string }
 *               isActive: { type: boolean }
 *     responses:
 *       200: { description: Category updated }
 *       404: { description: Category not found }
 *       409: { description: Category code conflict }
 */
router.patch('/:id',    updateCategoryValidation, updateCategory);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, description: MongoDB ObjectId }
 *     responses:
 *       204: { description: Category deleted }
 *       404: { description: Category not found }
 */
router.delete('/:id',    deleteCategoryValidation, deleteCategory);

/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id: { type: string, description: MongoDB ObjectId }
 *         name: { type: string }
 *         code: { type: string }
 *         description: { type: string }
 *         isActive: { type: boolean }
 *         isDeleted: { type: boolean }
 *         createdAt: { type: string, format: date-time }
 *         updatedAt: { type: string, format: date-time }
 *         createdBy: { type: string, description: User ID }
 *         updatedBy: { type: string, description: User ID }
 */
export const categoryRoutes = router;
