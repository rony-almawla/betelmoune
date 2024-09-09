import express from 'express';
import Group from '../models/groupModel.js';
import mongoose from 'mongoose';
import { isAuth } from '../utils.js';

const chatsRouter = express.Router();

// Get Groups which User added to them

chatsRouter.get('/mygroup/:userId', isAuth, async (req, res) => {
  const filter = {
    'members._id': new mongoose.Types.ObjectId(req.params.userId),
  };

  const groups = await Group.find(filter);

  if (groups) {
    res.status(200).json(groups);
  } else {
    res.status(404).json("User doesn't in any group");
  }
});

// Accept a User to join Workshop Group

chatsRouter.post('/addUserToGroup', isAuth, async (req, res) => {
  const filter = {
    slug: req.body.groupSlug,
  };

  const query = {
    $push: {
      members: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        profileImg: req.body.profileImg,
        isAdmin: req.body.isAdmin,
        _id: new mongoose.Types.ObjectId(req.body.userId),
      },
    },
  };

  const updatedGroup = await Group.updateOne(filter, query);

  if (updatedGroup) {
    // filter after added user to get all groups he is a member in
    const newFilter = {
      'members._id': new mongoose.Types.ObjectId(req.params.userId),
    };

    const groups = await Group.find(newFilter);
    res.status(200).json(groups);
  } else {
    res.status(404).json('User not a member in this group');
  }
});

export default chatsRouter;
