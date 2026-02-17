import { Router, Application } from 'express';
import { env } from './common/config/env';

// Modules
import { userRoutes } from './modules/users';
import { roleRoutes } from './modules/roles';
import { subscriptionRoutes } from './modules/subscriptions';
import { clinicRoutes } from './modules/clinics';
import { labRoutes } from './modules/labs';
import { adminRoutes } from './modules/admins';
import { appointmentRoutes } from './modules/appointment';
import { categoryRoutes } from './modules/category';
import { serviceRoutes } from './modules/service';
import { discountRoutes } from './modules/discount';
import { paymentRoutes } from './modules/payment';
import { reviewRoutes } from './modules/reviews';
import { slotTrackerRoutes } from './modules/slotTracker';
import { notificationTypeRoutes } from './modules/notificationType';
import { notificationRoutes } from './modules/notifications';
import { supportTicketRoutes } from './modules/supportTicket';
import { supportTicketHistoryRoutes } from './modules/supportTicketHistory';
import { mediaRoutes } from './modules/media';

// Routes
const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200: { description: OK }
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Modules
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/clinics', clinicRoutes);
router.use('/labs', labRoutes);
router.use('/admins', adminRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/categories', categoryRoutes);
router.use('/services', serviceRoutes);
router.use('/discounts', discountRoutes);
router.use('/payments', paymentRoutes);
router.use('/reviews', reviewRoutes);
router.use('/slots', slotTrackerRoutes);
router.use('/notification-types', notificationTypeRoutes);
router.use('/notifications', notificationRoutes);
router.use('/support-tickets', supportTicketRoutes);
router.use('/support-ticket-history', supportTicketHistoryRoutes);
router.use('/media', mediaRoutes);


export function registerRoutes(app: Application): void {
  app.use(env.API_PREFIX, router);
}

