import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import infrastructureRoutes from './routes/infrastructureRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
  }),
);
app.use(helmet());
app.use(morgan('tiny')); // 'combined' logs full headers/body — avoid for security

// Routes
app.use('/api/infrastructure', infrastructureRoutes);

export default app;
