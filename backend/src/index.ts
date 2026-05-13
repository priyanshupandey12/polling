import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import { initSocket } from './utils/socket.js';
import authRoutes from './routes/auth.routes.js';
import pollRoutes from './routes/poll.routes.js';
import questionRoutes from './routes/question.routes.js';
import responseRoutes from './routes/response.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import type { Request, Response, NextFunction } from 'express';

async function main() {
  const app = express();
  const server = http.createServer(app);
  const port = env.PORT;
  initSocket(server);

  app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,          
  }));
  app.use(express.json());
  app.use(cookieParser());     


  app.use('/api/auth', authRoutes);
  app.use('/api/polls', pollRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/responses', responseRoutes);
  app.use('/api/analytics', analyticsRoutes);

  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });


  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
      success: false,
      message,
    });
  });


  await connectDB();

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

main();