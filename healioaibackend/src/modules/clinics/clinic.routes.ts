import { Router } from 'express';
import {
  createClinic,
  getClinicById,
  listClinics,
  updateClinic,
  deleteClinic,
  createClinicValidation,
  getClinicByIdValidation,
  listClinicsValidation,
  updateClinicValidation,
  deleteClinicValidation,
} from './clinic.controller';

const router = Router();

/**
 * @openapi
 * /clinics:
 *   post:
 *     tags: [Clinics]
 *     summary: Create a clinic
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicName, registrationNumber, roleId, contactNumber, doctorName, consents]
 *             properties:
 *               clinicName: { type: string }
 *               registrationNumber: { type: string }
 *               roleId: { type: string, description: MongoDB ObjectId (24 hex chars) }
 *               address: { type: string, description: Optional address field }
 *               establishmentDate: { type: string, format: date, description: Optional establishment date }
 *               contactNumber: { type: string }
 *               emailId: { type: string, format: email }
 *               operatingHours:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day: { type: string, enum: [Mon, Tue, Wed, Thu, Fri, Sat, Sun] }
 *                     openTime: { type: string }
 *                     closeTime: { type: string }
 *                     isClosed: { type: boolean }
 *               specialisation: { type: array, items: { type: string } }
 *               consultationType: { type: string, enum: [in_person, online, both] }
 *               doctorName: { type: string, description: Name of the primary doctor }
 *               consents:
 *                 type: object
 *                 required: [termsAndConditions, policyTerms, medicalDisclaimer]
 *                 properties:
 *                   termsAndConditions: { type: boolean, enum: [true] }
 *                   policyTerms: { type: boolean, enum: [true] }
 *                   medicalDisclaimer: { type: boolean, enum: [true] }
 *     responses:
 *       201: { description: Clinic created }
 *       400: { description: Validation error }
 *       409: { description: Registration number or email already exists }
 */
router.post('/', createClinicValidation, createClinic);

/**
 * @openapi
 * /clinics:
 *   get:
 *     tags: [Clinics]
 *     summary: List clinics (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, default: 20 }
 *     responses:
 *       200: { description: Paginated list of clinics }
 */
router.get('/', listClinicsValidation, listClinics);

/**
 * @openapi
 * /clinics/{id}:
 *   get:
 *     tags: [Clinics]
 *     summary: Get clinic by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Clinic found }
 *       404: { description: Clinic not found }
 */
router.get('/:id', getClinicByIdValidation, getClinicById);

/**
 * @openapi
 * /clinics/{id}:
 *   patch:
 *     tags: [Clinics]
 *     summary: Update clinic
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
 *               clinicName: { type: string }
 *               registrationNumber: { type: string }
 *               roleId: { type: string }
 *               address: { type: string }
 *               establishmentDate: { type: string, format: date }
 *               contactNumber: { type: string }
 *               emailId: { type: string, format: email }
 *               operatingHours: { type: array }
 *               specialisation: { type: array }
 *               consultationType: { type: string, enum: [in_person, online, both] }
 *               doctorName: { type: string }
 *               consents: { type: object }
 *     responses:
 *       200: { description: Clinic updated }
 *       404: { description: Clinic not found }
 *       409: { description: Registration number or email already exists }
 */
router.patch('/:id', updateClinicValidation, updateClinic);

/**
 * @openapi
 * /clinics/{id}:
 *   delete:
 *     tags: [Clinics]
 *     summary: Delete clinic
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Clinic deleted }
 *       404: { description: Clinic not found }
 */
router.delete('/:id', deleteClinicValidation, deleteClinic);

export const clinicRoutes = router;
