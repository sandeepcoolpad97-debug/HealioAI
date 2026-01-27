import { Router, Application } from 'express';
import { env } from './common/config/env';
import { userRoutes } from './modules/users';
import { roleRoutes } from './modules/roles';
import { subscriptionRoutes } from './modules/subscriptions';

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

router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/subscriptions', subscriptionRoutes);

export function registerRoutes(app: Application): void {
  app.use(env.API_PREFIX, router);
}
