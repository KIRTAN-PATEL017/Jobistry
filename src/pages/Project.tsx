import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Briefcase, User, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Proposal {
  _id: string;
  freelancer : {
    id: string;
    name: string;
    rating?: number;
  },
  bidAmount: number;
  estimatedDays: number;
  coverLetter: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface ProjectDetail {
  _id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  status: string;
  createdAt: string;
  proposals: Proposal[];
  client: {
    name: string;
    rating?: number;
    location?: string;
    joined?: string;
  };
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const Project: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);

  const toggleProposal = (id: string) => {
    setExpandedProposalId((prev) => (prev === id ? null : id));
  };

  const handleProposalAction = async (proposalId: string, action: 'accept' | 'reject') => {
    try {
      await axios.patch(
        `http://localhost:5000/api/projects/${projectId}/proposals/${proposalId}/${action}`,
        {},
        { withCredentials: true }
      );
      // Refresh project data after action
      const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, { withCredentials: true });
      setProject(res.data.project);
      setExpandedProposalId(null);
    } catch (error) {
      console.error(`Failed to ${action} proposal`, error);
    }
  };
  
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/projects/${projectId}`, { withCredentials: true });
        setProject(res.data.project);
        console.log(res.data.project);
        setError('');
      } catch (err: any) {
        console.error(err);
        setError('Could not load project details');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) return <div className="text-center py-20">Loading project details...</div>;
  if (error || !project) return <div className="text-center py-20 text-red-500">{error || 'Project not found'}</div>;

  // Filter proposals to exclude rejected ones
  const nonRejectedProposals = project.proposals.filter((p) => p.status !== 'rejected');

  // Check if there is an accepted proposal (among non-rejected)
  const acceptedProposal = nonRejectedProposals.find((p) => p.status === 'accepted');

  return (
    <div className="max-w-4xl mx-auto mb-104">
      <div className="mb-6">
        <Link to={`/projects/client/${user?.id}`} className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          &larr; Back
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full">{project.category}</span>
          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
            Posted {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span className="bg-accent-100 text-accent-800 text-xs px-3 py-1 rounded-full">{nonRejectedProposals.length} proposals</span>

          <span className={getStatusColor(project.status) + ' text-xs px-3 py-1 rounded-full'}>{project.status}</span>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Main content */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-line mb-6">{project.description}</p>

            <h3 className="text-lg font-medium mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.skills.map((skill, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between flex-col md:flex-row">
          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-sm p-4 my-2 md:w-[49%]">
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">
                    ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">{new Date(project.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Briefcase size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{project.category}</p>
                </div>
              </div>
            </div>
          </div>
          {/* About the Client */}
          <div className="bg-white rounded-xl shadow-sm p-4 my-2 md:w-[49%]">
            <h2 className="text-lg font-semibold mb-4">About the Client</h2>
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">{project.client?.name || 'Client'}</p>
                <p className="text-sm text-gray-500">{project.client?.location || 'Unknown location'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <p className="text-sm">Payment Verified</p>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <p className="text-sm">Member since {project.client?.joined || '2023'}</p>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="text-gray-500 mr-2" />
                <p className="text-sm">{nonRejectedProposals.length} proposals received</p>
              </div>
            </div>
          </div>
        </div>

        {/* Proposals Section */}
        {acceptedProposal ? (
          <div className="bg-white rounded-xl shadow-sm p-4 my-6">
            <h2 className="text-lg font-semibold mb-4">Accepted Proposal</h2>
            <ProposalCard
              proposal={acceptedProposal}
              expandedProposalId={expandedProposalId}
              toggleProposal={toggleProposal}
              handleProposalAction={handleProposalAction}
              showActions={false} // No actions for accepted proposal
            />
          </div>
        ) : (
          nonRejectedProposals.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4 my-6">
              <h2 className="text-lg font-semibold mb-4">Proposals</h2>
              {nonRejectedProposals.map((proposal) => (
                <ProposalCard
                  key={proposal._id}
                  proposal={proposal}
                  expandedProposalId={expandedProposalId}
                  toggleProposal={toggleProposal}
                  handleProposalAction={handleProposalAction}
                  showActions={true}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

interface ProposalCardProps {
  proposal: Proposal;
  expandedProposalId: string | null;
  toggleProposal: (id: string) => void;
  handleProposalAction: (proposalId: string, action: 'accept' | 'reject') => void;
  showActions: boolean;
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  expandedProposalId,
  toggleProposal,
  handleProposalAction,
  showActions,
}) => {
  return (
    <div key={proposal._id} className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div>
          <Link to={`/freelancers/${proposal.freelancer.id}`} className="font-medium text-blue-600 hover:underline">
            {proposal.freelancer.name}
          </Link>
          <Star rating={proposal.freelancer.rating || 4.5} />
          <p className="text-sm text-gray-500 mt-1">
            ${proposal.bidAmount} | {proposal.estimatedDays} days
          </p>
        </div>
        {showActions && (
          <button
            onClick={() => toggleProposal(proposal._id)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {expandedProposalId === proposal._id ? 'Hide Details' : 'View Details'}
          </button>
        )}
      </div>
      {expandedProposalId === proposal._id && (
        <div className="mt-4">
          <p className="whitespace-pre-line">{proposal.coverLetter}</p>
          <div className="mt-4 flex space-x-4 items-center">
            {showActions && (
              <>
                <button
                  onClick={() => handleProposalAction(proposal._id, 'accept')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleProposalAction(proposal._id, 'reject')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            {proposal.status === 'accepted' && (
              <span className="text-green-600 font-semibold">Proposal Accepted</span>
            )}
            {proposal.status === 'rejected' && (
              <span className="text-red-600 font-semibold">Proposal Rejected</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple star rating display component
const Star: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={i} className="text-yellow-400">
        ★
      </span>
    );
  }
  if (halfStar)
    stars.push(
      <span key="half" className="text-yellow-400">
        ☆
      </span>
    );
  while (stars.length < 5) {
    stars.push(
      <span key={'empty' + stars.length} className="text-gray-300">
        ★
      </span>
    );
  }
  return <div>{stars}</div>;
};

export default Project;
