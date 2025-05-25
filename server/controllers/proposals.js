import { validationResult } from 'express-validator';
import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

export const createProposal = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Project is not open for proposals' });
    }

    const existingProposal = await Proposal.findOne({
      project: req.params.projectId,
      freelancer: req.user.id
    });

    if (existingProposal) {
      return res.status(400).json({ message: 'You have already submitted a proposal' });
    }

    const { coverLetter, bidAmount, estimatedDays } = req.body;

    const proposal = new Proposal({
      project: req.params.projectId,
      freelancer: req.user.id,
      coverLetter,
      bidAmount,
      estimatedDays
    });

    await proposal.save();

    project.proposals.push(proposal._id);
    await project.save();

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProposals = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'freelancer') {
      query.freelancer = req.user.id;
    } else {
      const projects = await Project.find({ client: req.user.id });
      query.project = { $in: projects.map(p => p._id) };
    }

    const proposals = await Proposal.find(query)
      .populate('project', 'title budget deadline')
      .populate('freelancer', 'name rating')
      .sort({ createdAt: -1 });

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('project')
      .populate('freelancer', 'name rating completedProjects');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    if (proposal.freelancer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (proposal.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot update non-pending proposal' });
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(updatedProposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const project = await Project.findById(proposal.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Project is not open' });
    }

    proposal.status = 'accepted';
    await proposal.save();

    project.status = 'in-progress';
    project.selectedProposal = proposal._id;
    await project.save();

    // Reject other proposals
    await Proposal.updateMany(
      { 
        project: project._id, 
        _id: { $ne: proposal._id },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const project = await Project.findById(proposal.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};