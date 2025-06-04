import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() , success : false});
    }

    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' , success : false});
    }

    user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.cookie('jwt', token);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      success : true
    });
  } catch (error) {
    res.cookie('jwt', token);
    res.status(500).json({ message: 'Server error', success : false });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), success : false });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' , success : false});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' , success : false});
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000, // optional: 1 day expiration
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      success : true
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' ,success : false});
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully',success : true });

  } catch (error) {
    res.status(500).json({ message: 'Server error',success : false });
  }
};

export const isValid = async (req, res) => {
  try{
    res.status(201).json({user : req.user, 'message' : "Valid user", success : true});
  }
  catch(err){
    res.status(500).json({ message: 'Server error' ,success : false});
  }
};