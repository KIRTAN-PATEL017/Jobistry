import { validationResult } from 'express-validator';
import Project from '../models/Project.js';
import Proposals from '../models/Proposal.js'
import User from '../models/User.js';

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

    const populatedProject = await project.populate({
      path: 'client',
      select: 'name email' // customize as needed
    });

    res.status(201).json({data: project, success : true});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProjects = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({ client: userId })
      .populate('client', 'name email') // optional: populate client details
      .populate('selectedProposal')     // optional: populate selected proposal if needed
      .sort({ createdAt: -1 });         // optional: sort newest first
 
    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for this user.' });
    }

    res.status(200).json({projects : projects, success : true});
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};

export const getProject = async (req, res) => {
  const {projectId} = req.params;

  try { 
    const project = await Project.findOne({
      _id: projectId
    }).populate('proposals') // Optional: populate if needed
      .populate('client')
      .populate('selectedProposal'); // Optional

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error while fetching the project' });
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


export const browseProjects = async (req, res) => {
  try {
    const filters = req.body;

    const query = { status: 'open' };

    if (filters.skills?.length > 0) {
      query.skills = { $in: filters.skills };
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.location) {
      query['clientLocation'] = filters.location; // assuming client location is stored
    }

    if (filters.budgetMin || filters.budgetMax) {
      query['budget.min'] = { $gte: filters.budgetMin || 0 };
      query['budget.max'] = { $lte: filters.budgetMax || Number.MAX_VALUE };
    }

    const projects = await Project.find(query)
      .populate('client', 'name email') // optional
      .sort({ createdAt: -1 });

    res.status(200).json({ projects, success: true });
  } catch (error) {
    console.error('Error fetching browseable projects:', error);
    res.status(500).json({ message: 'Server error while browsing projects' });
  }
};

export const sendProposal = async (req, res) => {
  try {
    const freelancerId = req.user.id; // From authenticated token
    const { projectId } = req.params;
    const { coverLetter, bidAmount, estimatedDays, attachments } = req.body;

    // Basic validation
    if (!coverLetter || !bidAmount || !estimatedDays) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check project existence
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Prevent duplicate proposals
    const existingProposal = await Proposals.findOne({
      freelancer: freelancerId,
      project: projectId,
    });

    if (existingProposal) {
      return res.status(400).json({ success : false, message: 'You have already applied for this project.' });
    }

    // Create proposal
    const proposal = new Proposals({
      project: projectId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
      estimatedDays,
      attachments, // optional: expects array of { filename, path }
    });

    await proposal.save();

    // Add proposal to project
    project.proposals.push(proposal._id);
    await project.save();

    res.status(201).json({ success : true, message: 'Proposal submitted successfully.', proposal });
  } catch (error) {
    console.error('Error in sendProposal:', error);
    res.status(500).json({ success : false, message: 'Server error while submitting proposal.' });
  }
};
