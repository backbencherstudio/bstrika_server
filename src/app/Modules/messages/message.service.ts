

import { Model } from 'mongoose';
import { IMessage, IChatMessage } from './message.interface';
import { Server, Socket } from 'socket.io';

class MessageService {
  private users: { [key: string]: string } = {};
  private onlineUsers: Map<string, boolean> = new Map();
  private io: Server;
  private MessageModel: Model<IMessage>;

  constructor(io: Server, MessageModel: Model<IMessage>) {
    this.io = io;
    this.MessageModel = MessageModel;
  }

  async handleJoin(socket: Socket, username: string) {
    this.users[socket.id] = username;
    this.onlineUsers.set(username, true);
    socket.join(username); // user-specific room

    try {
      const chats = await this.MessageModel.find().sort({ timestamp: 1 }).lean();
      const unread = await this.getUnreadMessages(username);

      socket.emit('message history', chats);
      socket.emit('unread_messages', unread);

      this.io.emit('online_users', Object.fromEntries(this.onlineUsers));
      this.io.emit('user list', Object.values(this.users));
    } catch (err) {
      console.error('Error fetching message history:', err);
    }
  }

  async handleMessage({ recipient, content, sender, timestamp, senderService, reciverService }: IChatMessage) {
    const chatMessage = {
      sender,
      recipient,
      content,
      timestamp,
      senderService, 
      reciverService,
      read: false,
    };

    try {
      const newMessage = await this.MessageModel.create(chatMessage);

      // Send unread count to recipient
      const unread = await this.getUnreadMessages(recipient);
      this.io.to(recipient).emit('unread_messages', unread);

      // ✅ Send message only to recipient and sender
      this.io.to(recipient).emit('message', newMessage);
      this.io.to(sender).emit('message', newMessage);

    } catch (err) {
      console.error('Error saving message:', err);
    }
  }

  handleDisconnect(socket: Socket) {
    const username = this.users[socket.id];
    if (username) {
      this.onlineUsers.delete(username);
      delete this.users[socket.id];
      console.log(`${username} disconnected.`);

      this.io.emit('online_users', Object.fromEntries(this.onlineUsers));
      this.io.emit('user list', Object.values(this.users));
    }
  }

  async handleDeleteMessage(messageId: string) {
    try {
      const result = await this.MessageModel.deleteOne({ _id: messageId });
      if (result.deletedCount > 0) {
        this.io.emit('message_deleted', messageId);
        console.log(`Message ${messageId} deleted successfully`);
      }
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  }

  async markMessagesAsRead(sender: string, recipient: string) {
    try {
      const result = await this.MessageModel.updateMany(
        { sender, recipient, read: false },
        { $set: { read: true } }
      );

      const unread = await this.getUnreadMessages(recipient);
      this.io.to(recipient).emit('unread_messages', unread);

      return result.modifiedCount;
    } catch (err) {
      console.error('Error marking messages as read:', err);
      throw err;
    }
  }

  async getUnreadMessages(userId: string) {
    try {
      const unreadMessages = await this.MessageModel
        .find({ recipient: userId, read: false })
        .lean();

      const unreadCounts: { [key: string]: number } = {};
      unreadMessages.forEach((msg) => {
        if (!msg.read) {
          unreadCounts[msg.sender] = (unreadCounts[msg.sender] || 0) + 1;
        }
      });

      return unreadCounts;
    } catch (err) {
      console.error('Error fetching unread messages:', err);
      throw err;
    }
  }

  handleUserStatus(username: string, status: boolean) {
    if (status) {
      this.onlineUsers.set(username, true);
    } else {
      this.onlineUsers.delete(username);
    }
    this.io.emit('online_users', Object.fromEntries(this.onlineUsers));
  }
}

export default MessageService;









//=================================================================================
//=================================================================================
//=================================================================================


// import { Model } from 'mongoose';
// import { IMessage, IChatMessage } from './message.interface';
// import { Server, Socket } from 'socket.io';

// class MessageService {
//   private users: { [key: string]: string } = {};
//   private onlineUsers: Map<string, boolean> = new Map();
//   private io: Server;
//   private MessageModel: Model<IMessage>;

//   constructor(io: Server, MessageModel: Model<IMessage>) {
//     this.io = io;
//     this.MessageModel = MessageModel;
//   }


//   async handleJoin(socket: Socket, username: string) {
//   this.users[socket.id] = username;
//   this.onlineUsers.set(username, true);
//   socket.join(username); // user-specific room
  

//   try {
//     const chats = await this.MessageModel.find().sort({ timestamp: 1 }).lean();
//     const unread = await this.getUnreadMessages(username); // ✅ fetch unread messages

//     socket.emit('message history', chats);
//     socket.emit('unread_messages', unread); // ✅ send unread count

//     this.io.emit('online_users', Object.fromEntries(this.onlineUsers));
//     this.io.emit('user list', Object.values(this.users));
//   } catch (err) {
//     console.error('Error fetching message history:', err);
//   }
// }

//   async handleMessage({ recipient, content, sender, timestamp }: IChatMessage) {
//   const chatMessage = {
//     sender,
//     recipient,
//     content,
//     timestamp,
//     read: false,
//   };

//   try {
//     const newMessage = await this.MessageModel.create(chatMessage);

//     // Update exchanges collection updatedAt field
    
//     // Notify recipient only
//     const unread = await this.getUnreadMessages(recipient);
//     this.io.to(recipient).emit('unread_messages', unread); // ✅ send only to recipient

//     this.io.emit('message', newMessage);
//   } catch (err) {
//     console.error('Error saving message:', err);
//   }
// }


//   handleDisconnect(socket: Socket) {
//     const username = this.users[socket.id];
//     if (username) {
//       this.onlineUsers.delete(username);
//       delete this.users[socket.id];
//       console.log(`${username} disconnected.`);

//       this.io.emit('online_users', Object.fromEntries(this.onlineUsers));
//       this.io.emit('user list', Object.values(this.users));
//     }
//   }

//   async handleDeleteMessage(messageId: string) {
//     try {
//       const result = await this.MessageModel.deleteOne({ _id: messageId });
//       if (result.deletedCount > 0) {
//         this.io.emit('message_deleted', messageId);
//         console.log(`Message ${messageId} deleted successfully`);
//       }
//     } catch (err) {
//       console.error('Error deleting message:', err);
//     }
//   }


//   async markMessagesAsRead(sender: string, recipient: string) {
//   try {
//     const result = await this.MessageModel.updateMany(
//       { sender, recipient, read: false },
//       { $set: { read: true } }
//     );

//     const unread = await this.getUnreadMessages(recipient); // update live
//     this.io.to(recipient).emit('unread_messages', unread); // ✅ update client

//     return result.modifiedCount;
//   } catch (err) {
//     console.error('Error marking messages as read:', err);
//     throw err;
//   }
// }


//   async getUnreadMessages(userId: string) {
//     try {
//       const unreadMessages = await this.MessageModel
//         .find({ recipient: userId, read: false })
//         .lean();

//       const unreadCounts: { [key: string]: number } = {};
//       unreadMessages.forEach((msg) => {
//         if (!msg.read) {
//           unreadCounts[msg.sender] = (unreadCounts[msg.sender] || 0) + 1;
//         }
//       });

//       return unreadCounts;
//     } catch (err) {
//       console.error('Error fetching unread messages:', err);
//       throw err;
//     }
//   }

//   handleUserStatus(username: string, status: boolean) {
//     if (status) {
//       this.onlineUsers.set(username, true);
//     } else {
//       this.onlineUsers.delete(username);
//     }
//     this.io.emit('online_users', Object.fromEntries(this.onlineUsers));
//   }



// }

// export default MessageService;
