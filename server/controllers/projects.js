import { validationResult } from 'express-validator';
import Project from '../models/Project.js';

export const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, skills, budget, deadline } = req.body;

    const project = new Project({
      title,
      description,
      category,
      skills,
      budget,
      deadline,
      client: req.user.id
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { category, skills, status, budget } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (status) {
      query.status = status;
    }

    if (budget) {
      const [min, max] = budget.split('-');
      query['budget.min'] = { $gte: parseInt(min) };
      query['budget.max'] = { $lte: parseInt(max) };
    }

    if (req.user.role === 'client') {
      query.client = req.user.id;
    }

    const projects = await Project.find(query)
      .populate('client', 'name rating')
      .populate('proposals', 'freelancer bidAmount status')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name rating location')
      .populate({
        path: 'proposals',
        populate: {
          path: 'freelancer',
          select: 'name rating completedProjects'
        }
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await project.remove();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};