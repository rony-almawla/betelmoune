import express from 'express';
import Message from '../models/MessageModel.js';

const messagesRouter = express.Router();

messagesRouter.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const newMessage = new Message(req.body);

    await newMessage.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error while sending message!!' });
  }
});

export default messagesRouter;
