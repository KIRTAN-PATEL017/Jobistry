import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare, User, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

interface Budget {
  min: number;
  max: number;
}

interface Project {
  id: string;
  title: string;
  category: string;
  status: string;
  proposals: number;
  budget: Budget;
}

interface Proposal {
  id: string;
  projectTitle: string;
  clientName: string;
  status: string;
  bidAmount: Budget;
  submitDate: string;
}

const WelcomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  const [propojects, setPropojects] = useState<(Project | Proposal)[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (user?.role === 'client') {
          const res = await axios.get(`http://localhost:5000/api/projects/client/${user?.id}`, {
            withCredentials: true,
          });
          setPropojects(res.data.projects || []);
        } else {
          const res = await axios.get(`http://localhost:5000/api/proposals/${user?.id}`, {
            withCredentials: true,
          });
          setPropojects(res.data.proposals || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-700 rounded-xl p-6 md:p-8 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100 mb-6">
          {isClient
            ? 'Track your projects and find talent for your next big idea.'
            : 'Find your next gig and manage your active proposals.'}
        </p>
        <Link
          to={isClient ? '/post-project' : '/browse-jobs'}
          className="inline-flex items-center bg-white text-primary-700 hover:bg-primary-50 transition-colors px-4 py-2 rounded-md font-medium"
        >
          {isClient ? (
            <>
              <PlusCircle size={18} className="mr-2" />
              Post a New Project
            </>
          ) : (
            <>
              <Briefcase size={18} className="mr-2" />
              Find New Projects
            </>
          )}
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-lg mr-4">
              <Briefcase size={24} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {isClient ? 'Active Projects' : 'Submitted Proposals'}
              </p>
              <p className="text-2xl font-bold">{isClient ? '3' : '8'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-secondary-100 rounded-lg mr-4">
              <MessageSquare size={24} className="text-secondary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">New Messages</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-accent-100 rounded-lg mr-4">
              <User size={24} className="text-accent-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {isClient ? 'Total Proposals' : 'Completed Projects'}
              </p>
              <p className="text-2xl font-bold">{isClient ? '27' : '15'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isClient ? 'Your Projects' : 'Your Proposals'}
          </h2>
          <Link
            to={isClient ? `/projects/client/${user.id}` : '/proposals'}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        {/* Project/Proposal List */}
        <div className="space-y-4">
          {isClient
            ? (propojects as Project[]).map((project, i) => (
                <Link
                  key={i}
                  to={`/projects/${project.id}`}
                  className="block bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.category}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {project.proposals} proposals
                      </span>
                      <span className="text-xs text-gray-600">
                        Budget: ₹{project.budget.min} - ₹{project.budget.max}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            : (propojects as Proposal[]).map((proposal, i) => (
                <Link
                  key={i}
                  to={`/proposals/${proposal.id}`}
                  className="block bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-medium">{proposal.projectTitle}</h3>
                      <p className="text-sm text-gray-600">Client: {proposal.clientName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(proposal.status)}`}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-600">
                        Bid: ₹{proposal.bidAmount.min} - ₹{proposal.bidAmount.max}
                      </span>
                      <span className="text-xs text-gray-600">
                        Submitted: {proposal.submitDate}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
        </div>

        {propojects.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {isClient
                ? "You haven't posted any projects yet."
                : "You haven't submitted any proposals yet."}
            </p>
            <Link
              to={isClient ? '/post-project' : '/browse-jobs'}
              className="btn btn-primary"
            >
              {isClient ? 'Post Your First Project' : 'Browse Projects'}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeDashboard;
