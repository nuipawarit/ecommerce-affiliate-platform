import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error-handler';
import productRoutes from './routes/products';
import campaignRoutes from './routes/campaigns';
import linkRoutes from './routes/links';
import redirectRoutes from './routes/redirect';
import analyticsRoutes from './routes/analytics';
import docsRoutes from './routes/docs';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/products', productRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/docs', docsRoutes);
app.use('/go', redirectRoutes);

app.use(errorHandler);

export { app };
