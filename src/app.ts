/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
import session from 'express-session';
import { Server } from 'socket.io';
import { createServer } from 'http';
import messageRoutes from './app/Modules/messages/message.route';
import MessageController from './app/Modules/messages/message.controller';
import MessageService from './app/Modules/messages/message.service';
import MessageModel from './app/Modules/messages/message.module';

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.4.42:3000',
      'http://192.168.5.6:3000',
    ],
    credentials: true,
  },
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://192.168.4.42:3000',
    'http://192.168.5.6:3000',
    'http://localhost:5000'
  ],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use(
  session({
    secret: 'changeit',
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 2 * 60 * 1000,
      httpOnly: true,
      sameSite: 'none',
      secure: false,
    },
  }),
);

app.use('/uploads', express.static('uploads'));

// Initialize message service and controller
const messageService = new MessageService(io, MessageModel);
const messageController = new MessageController(messageService);

// Use all routes
app.use('/api/v1', router);
app.use('/api/v1', messageRoutes(messageController));

app.get('/api/v1', (req, res) => {
  res.send({ message: 'server running successfully' });
});

app.use(globalErrorHandler);

export default app;

// Change the export to include httpServer
export { app, httpServer };
