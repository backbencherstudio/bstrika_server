import app from './app';
import { Server } from 'socket.io';
import http from 'http';
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://192.168.4.42:3000',
      'http://localhost:5000'
    ],
    credentials: true,
  },
});
// Removed conflicting import of httpServer
import config from './app/config';
import mongoose from 'mongoose';
import MessageModel from './app/Modules/messages/message.module';
import MessageService from './app/Modules/messages/message.service';
import { seedAdmin } from './app/DB/admin';
async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
     seedAdmin()
    const messageService = new MessageService(io, MessageModel);
    io.on('connection', (socket) => {
      socket.on('join', (username) =>
        messageService.handleJoin(socket, username),
      );
      socket.on('message', (messageData) =>
        messageService.handleMessage(messageData),
      );
      socket.on('delete_message', (messageId) =>
        messageService.handleDeleteMessage(messageId),
      );
      socket.on('disconnect', () => messageService.handleDisconnect(socket));
      socket.on('user_offline', (username) =>
        messageService.handleUserStatus(username, false),
      );
      socket.on('user_online', (username) =>
        messageService.handleUserStatus(username, true),
      );

      socket.on('hide_message_for_sender', async ({ messageId, userId }) => {
        try {
          const result = await MessageModel.updateOne(
            { _id: messageId },
            { $addToSet: { hiddenFor: userId } },
          );

          if (result.modifiedCount > 0) {
            socket.emit('message_hidden', { messageId, userId });
          }
        } catch (err) {
          console.error('Error hiding message:', err);
        }
      });
    });
    // app.listen(config.port, () => {
    //   console.log(`Example app listening on PORT === ${config.port}`);
    // });
    httpServer.listen(config.port, () => {
      console.log(`Server is running on PORT === ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();
