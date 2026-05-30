import * as express from 'express';
import { Express } from 'express';
import * as cors from 'cors';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';
import infrastructureRoutes from './routes/infrastructureRoutes';

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
  }),
);
app.use(helmet());
app.use(morgan('tiny'));

// Routes
app.use('/api/infrastructure', infrastructureRoutes);

export default app;
