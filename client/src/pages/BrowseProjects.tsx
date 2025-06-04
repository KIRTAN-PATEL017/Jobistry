import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  skills: string[];
  status: string;
  proposals: string[];
  client?: {
    name: string;
    email: string;
    location?: string;
  };
}

interface Filter {
  skills: string[];
  location: string;
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-800';
    case 'in-progress': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-200 text-gray-700';
  }
};

const BrowseProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>({ skills: [], location: '' });
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const {user} = useAuth();

  // State to manage proposal modal
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [currentProjectForProposal, setCurrentProjectForProposal] = useState<Project | null>(null);

  // Proposal form state
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [estimatedDays, setEstimatedDays] = useState<number | ''>('');
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [proposalLoading, setProposalLoading] = useState(false);


  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    setExpandedProjectId(null);
    try {
      const res = await axios.post('https://jobistry-api.onrender.com/api/projects/browse', filter, {
        withCredentials: true,
      });
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(prev => ({
      ...prev,
      skills: value.split(',').map(skill => skill.trim()),
    }));
  };

  const toggleExpand = (projectId: string) => {
    setExpandedProjectId(prev => (prev === projectId ? null : projectId));
  };

  // Open proposal form modal for a specific project
  const openProposalForm = (project: Project) => {
    setCurrentProjectForProposal(project);
    setCoverLetter('');
    setBidAmount('');
    setEstimatedDays('');
    setProposalError(null);
    setShowProposalForm(true);
  };

  // Close modal
  const closeProposalForm = () => {
    setShowProposalForm(false);
    setCurrentProjectForProposal(null);
  };

  // Handle proposal form submission
  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setProposalError(null);

    if (!coverLetter || !bidAmount || !estimatedDays) {
      setProposalError('All fields are required.');
      return;
    }

    if (bidAmount <= 0 || estimatedDays <= 0) {
      setProposalError('Bid amount and estimated days must be positive numbers.');
      return;
    }

    if (!currentProjectForProposal) {
      setProposalError('Invalid project selected.');
      return;
    }

    setProposalLoading(true);
    try {
      await axios.post(
        `/api/projects/${currentProjectForProposal._id}/proposals`,
        {
          coverLetter,
          bidAmount,
          estimatedDays
        },
        {
          withCredentials: true
        }
      );
      // Optionally, refresh projects to update proposals count
      fetchProjects();
      closeProposalForm();
    } catch (error) {
      setProposalError(error.response.data.message);
    } finally {
      setProposalLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Browse Projects</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filter.location}
            onChange={handleFilterChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="skills"
            placeholder="Skills (comma-separated)"
            onChange={handleSkillChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={fetchProjects}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-gray-600">
          <Loader className="animate-spin mr-2" />
          Loading projects...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-10">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No projects found.</div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const isExpanded = expandedProjectId === project._id;

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg p-4 cursor-pointer`}
                onClick={() => toggleExpand(project._id)}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-medium text-2xl">{project.title}</h3>
                    <p className="text-sm text-gray-600">{project.category}</p>
                    <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-1">
                      {project.skills.map((skill, index) => (
                        <p
                          key={index}
                          className="bg-blue-100 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {skill}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-4 text-sm">
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {project.proposals.length} proposals
                    </span>
                    <span className="text-xs text-gray-600">
                      Budget: ${project.budget.min} - ${project.budget.max}
                    </span>
                    <span className="text-xs text-gray-600">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 border-t pt-4 text-gray-700"
                      onClick={(e) => e.stopPropagation()} // prevent toggle when clicking inside expanded area
                    >
                      <p className="mb-4 whitespace-pre-wrap">{project.description}</p>
                      <p className="mb-1 font-semibold">
                        Client: {project.client?.name || 'Unknown'} ({project.client?.location || 'N/A'})
                      </p>
                      { (user?.role == "freelancer") && <button
                        onClick={() => openProposalForm(project)}
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                      >
                        Send Proposal
                      </button>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Proposal Form Modal */}
      <AnimatePresence>
        {showProposalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeProposalForm}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()} // prevent closing modal when clicking inside form
            >
              <h2 className="text-xl font-semibold mb-4">Send Proposal</h2>
              <form onSubmit={submitProposal} className="space-y-4">
                <div>
                  <label htmlFor="coverLetter" className="block font-medium mb-1">
                    Cover Letter
                  </label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={5}
                    className="border p-2 rounded w-full"
                    placeholder="Write your cover letter..."
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bidAmount" className="block font-medium mb-1">
                    Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                    min={1}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="estimatedDays" className="block font-medium mb-1">
                    Estimated Days to Complete
                  </label>
                  <input
                    type="number"
                    id="estimatedDays"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(Number(e.target.value))}
                    className="border p-2 rounded w-full"
                    min={1}
                    required
                  />
                </div>

                {proposalError && (
                  <p className="text-red-600 text-sm">{proposalError}</p>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeProposalForm}
                    className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                    disabled={proposalLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={proposalLoading}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {proposalLoading ? 'Sending...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrowseProjects;
