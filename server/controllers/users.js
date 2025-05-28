import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const getProfile = async (req, res) => {
  try {
    const {userId} = req.params;
    const user = await User.findById(userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {userId} = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, bio, skills, hourlyRate, location } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.skills = skills || user.skills;
    user.hourlyRate = hourlyRate || user.hourlyRate;
    user.location = location || user.location;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getFreelancers = async (req, res) => {
  try {
    const { skills, hourlyRate, rating } = req.query;
    let query = { role: 'freelancer' };

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (hourlyRate) {
      query.hourlyRate = { $lte: parseInt(hourlyRate) };
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    const freelancers = await User.find(query)
      .select('-password')
      .sort({ rating: -1 });

    res.json(freelancers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};