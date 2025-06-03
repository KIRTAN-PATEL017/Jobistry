import Contract from '../models/Contract.js';
import Proposal from '../models/Proposal.js';
import Project from '../models/Project.js';

export const getContracts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contracts = await Contract.find({
      $or: [{ client: userId }, { freelancer: userId }],
    })
      .populate('project')
      .populate('freelancer', 'name email')
      .populate('client', 'name email')
      .populate('proposal');

    res.status(200).json({ contracts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
};
