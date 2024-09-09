import express from 'express';
import Workshop from '../models/workshopModel.js';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken } from '../utils.js';

const workshopRouter = express.Router();

workshopRouter.get('/', async (req, res) => {
  const workshops = await Workshop.find();
  res.send(workshops);
});

workshopRouter.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkshop = await Workshop.findByIdAndDelete(id);

    if (!deletedWorkshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    res.status(200).json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

workshopRouter.get('/slug/:slug', async (req, res) => {
  try {
    const workshop = await Workshop.findOne({ slug: req.params.slug });

    if (workshop) {
      res.send(workshop);
    } else {
      res.status(404).send({ message: 'Workshop Not Found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

workshopRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const workshop = await Workshop.findById(req.params.id);

      if (workshop) {
        workshop.name = req.body.name || workshop.name;
        workshop.slug = req.body.slug || workshop.slug;
        workshop.description = req.body.description || workshop.description;
        workshop.date = req.body.date || workshop.date;
        workshop.duration = req.body.duration || workshop.duration;
        workshop.capacity = req.body.capacity || workshop.capacity;
        workshop.price = req.body.price || workshop.price;

        const updatedWorkshop = await workshop.save();

        res.json({
          _id: updatedWorkshop._id,
          name: updatedWorkshop.name,
          slug: updatedWorkshop.slug,
          description: updatedWorkshop.description,
          date: updatedWorkshop.date,
          duration: updatedWorkshop.duration,
          capacity: updatedWorkshop.capacity,
          price: updatedWorkshop.price,
        });
      } else {
        res.status(404).send({ message: 'Workshop not found' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Error updating workshop', error });
    }
  })
);

workshopRouter.put('/:id/register', async (req, res) => {
  console.log('lllll');
  try {
    console.log('lllll');
    const workshop = await Workshop.findById(req.params.id);
    if (workshop) {
      if (!workshop.registeredUsers.includes(req.body.userId)) {
        workshop.registeredUsers.push(req.body.userId);
        await workshop.save();
        res.status(200).json({ message: 'User registered successfully' });
      } else {
        res.status(400).json({ message: 'User is already registered' });
      }
    } else {
      res.status(404).json({ message: 'Workshop not found' });
    }
  } catch (error) {
    res.status(500).json({ message: getError(error) });
  }
});

workshopRouter.get('/myworkshops/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const workshops = await Workshop.find({ registeredUsers: userId });
    if (workshops.length > 0) {
      res.json(workshops);
    } else {
      res.status(404).json({ message: 'No workshops found for this user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default workshopRouter;
