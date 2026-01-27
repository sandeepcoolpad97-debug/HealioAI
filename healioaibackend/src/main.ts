import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env } from './common/config/env';
import { connectDb } from './common/db/connection';
import { logger } from './common/logger/logger';
import { errorHandler } from './common/errors/error-handler.middleware';
import { swaggerSpec } from './common/swagger/swagger.config';
import { registerRoutes } from './routes';

const app = express();

app.use(cors());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

registerRoutes(app);

app.use(errorHandler);

async function bootstrap(): Promise<void> {
  await connectDb();
  app.listen(env.PORT, () => {
    logger.info(`Server listening on port ${env.PORT}`, {
      env: env.NODE_ENV,
      apiPrefix: env.API_PREFIX,
      docs: '/api-docs',
    });
  });
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed', { err });
  process.exit(1);
});
