import { validationResult } from 'express-validator';
import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Contract from '../models/Contract.js';
import Conversation from '../models/Conversation.js';

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

export const getUserProposals = async (req, res) => {
  try {
    const {userId} = req.params;

    const proposals = await Proposal.find({ freelancer: userId })
      .populate('project')
      .sort({ createdAt: -1 });

    res.status(200).json({ proposals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findOne({ 
        _id: req.params.id, 
        status: { $ne: 'rejected' } // Only fetch if not rejected
      })
      .populate('project')
      .populate('freelancer', 'name rating completedProjects');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found or rejected' });
    }

    res.json(proposal);
  } catch (error) {
    console.error(error);
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

export const updateProposalStatus = async (req, res) => {
  const { projectId, proposalId, action } = req.params;

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const proposal = await Proposal.findOne({ _id: proposalId, project: projectId });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    if (proposal.status !== 'pending') {
      return res.status(400).json({ message: 'Proposal already processed' });
    }

    proposal.status = action === 'accept' ? 'accepted' : 'rejected';
    await proposal.save();

    if (action === 'accept') {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: 'Project not found' });

      await Project.findByIdAndUpdate(projectId, {
        selectedProposal: proposalId,
        status: 'in-progress',
      });

      let contract = await Contract.findOne({ proposal: proposal._id });
      if (!contract) {
        contract = await Contract.create({
          project: projectId,
          proposal: proposalId,
          freelancer: proposal.freelancer,
          client: project.client,
        });

        // Create conversation after contract creation
        await Conversation.create({
          contractId: contract._id,
          participants: [proposal.freelancer, project.client],
        });
      }
    }

    return res.status(200).json({ message: `Proposal ${action}ed successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
