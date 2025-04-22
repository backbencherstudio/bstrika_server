/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middleware/globalErrorHandlear';
import session from 'express-session';
import MessageModel from './app/Modules/messages/message.module';
import { Server } from 'socket.io';
import { createServer } from 'http';
const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.4.42:3000',
    ],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.4.42:3000',
    ],
    credentials: true,
  }),
);

// app.use(
//   session({
//     secret: "changeit",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 2 * 60 * 1000 },
//   })
// );

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

app.use('/api/v1', router);

app.get('/chats', async (req, res) => {
  try {
    const chats = await MessageModel.find().sort({ timestamp: -1 }).lean();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

app.post('/messages/mark-read', async (req, res) => {
  try {
    const { sender, recipient } = req.body;
    const result = await MessageModel.updateMany(
      {
        sender: sender,
        recipient: recipient,
        read: false,
      },
      {
        $set: { read: true },
      },
    );

    if (result.modifiedCount > 0) {
      io.emit('messages_read', { sender, recipient });
    }

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).json({ error: 'Error marking messages as read' });
  }
});

app.get('/messages/unread/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadMessages = await MessageModel.find({
      recipient: userId,
      read: false,
    }).lean();

    const unreadCounts: { [key: string]: number } = {};
    unreadMessages.forEach((msg) => {
      if (!msg.read) {
        unreadCounts[msg.sender] = (unreadCounts[msg.sender] || 0) + 1;
      }
    });

    res.json(unreadCounts);
  } catch (err) {
    console.error('Error fetching unread messages:', err);
    res.status(500).json({ error: 'Error fetching unread messages' });
  }
});
app.get('/', (req, res) => {
  res.send({ message: 'server running successfully' });
});

app.use(globalErrorHandler);

export default app;
