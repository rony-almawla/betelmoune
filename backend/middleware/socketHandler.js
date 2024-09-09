import { Server } from 'socket.io';
import mongoose from 'mongoose';
import Group from '../models/groupModel.js';

export const setupSocketIO = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle joining a room
    socket.on('joinRoom', (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.id} joined group ${groupId}`);
    });

    // Handle leaving a room
    socket.on('leaveRoom', (groupId) => {
      socket.leave(groupId);
      console.log(`User ${socket.id} left group ${groupId}`);
    });

    // Handle sending a message
    socket.on('sendmessage', async (data) => {
      const { groupId, message, senderId, senderName, profileImg, times } =
        data;

      try {
        const filter = { _id: groupId };
        const query = {
          $push: {
            messages: {
              messageId: new mongoose.Types.ObjectId(),
              text: message,
              senderId,
              senderName,
              profileImg,
              timestamp: times,
            },
          },
        };
        const storedMessage = await Group.updateOne(filter, query);

        if (storedMessage.acknowledged) {
          const updatedGroup = await Group.findById(groupId);

          if (updatedGroup) {
            io.to(groupId).emit('receiveMessage', updatedGroup.messages);
          } else {
            console.log('Group not found');
          }
        } else {
          socket.emit('error', { message: 'Failed to send message' });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle deleting a message
    socket.on('deletemessage', async (data) => {
      const { groupId, messageId } = data;

      try {
        const groupObjectId = new mongoose.Types.ObjectId(groupId);
        const messageObjectId = new mongoose.Types.ObjectId(messageId);

        const filter = { _id: groupObjectId };
        const update = { $pull: { messages: { messageId: messageObjectId } } };

        const result = await Group.updateOne(filter, update);

        if (result.modifiedCount) {
          const updatedGroup = await Group.findById(groupObjectId);

          if (updatedGroup) {
            io.to(groupId).emit('messageDeleted', messageId);
          }
        } else {
          socket.emit('error', { message: 'Failed to delete message' });
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};
