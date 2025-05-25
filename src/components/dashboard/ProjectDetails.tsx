import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Clock, Briefcase, User, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  duration: string;
  clientName: string;
  clientRating: number;
  clientLocation: string;
  clientJoined: string;
  postedAt: string;
  proposals: number;
}

// Mock project data
const mockProject: ProjectDetail = {
  id: '1',
  title: 'E-commerce Website Redesign and Development',
  description: `We are looking for an experienced web developer to redesign our e-commerce website. The current site is built on WordPress with WooCommerce, but we're open to other platforms if they better suit our needs.

  Key requirements:
  - Modern, responsive design
  - Improved product filtering and search
  - Optimized checkout process
  - Integration with our inventory management system
  - SEO optimization
  
  The ideal candidate will have previous experience with e-commerce sites and can provide examples of similar work.`,
  category: 'Web Development',
  skills: ['HTML/CSS', 'JavaScript', 'React', 'WordPress', 'WooCommerce', 'UI/UX Design'],
  budget: {
    min: 2500,
    max: 3500,
  },
  deadline: 'July 15, 2025',
  duration: '2-3 weeks',
  clientName: 'John Doe',
  clientRating: 4.8,
  clientLocation: 'New York, USA',
  clientJoined: 'January 2023',
  postedAt: '3 days ago',
  proposals: 12,
};

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isClient = user?.role === 'client';
  
  // In a real app, you would fetch the project data based on the id
  const project = mockProject;
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full">
            {project.category}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
            Posted {project.postedAt}
          </span>
          <span className="bg-accent-100 text-accent-800 text-xs px-3 py-1 rounded-full">
            {project.proposals} proposals
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2">
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

          {!isClient && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Submit a Proposal</h2>
              <p className="text-gray-600 mb-4">
                Interested in this project? Submit a proposal to connect with the client and discuss further details.
              </p>
              <Link to={`/submit-proposal/${id}`} className="btn btn-primary">
                Submit Proposal
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <DollarSign size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium">${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Deadline</p>
                  <p className="font-medium">{project.deadline}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={18} className="text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Duration</p>
                  <p className="font-medium">{project.duration}</p>
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
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">About the Client</h2>
            <div className="flex items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="font-medium">{project.clientName}</p>
                <p className="text-sm text-gray-500">{project.clientLocation}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-500 mr-2" />
                <p className="text-sm">Payment Verified</p>
              </div>
              <div className="flex items-center">
                <Star rating={project.clientRating} />
                <p className="text-sm ml-2">{project.clientRating.toFixed(1)} rating</p>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <p className="text-sm">Member since {project.clientJoined}</p>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="text-gray-500 mr-2" />
                <p className="text-sm">15 projects posted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Star rating component
const Star: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      // Full star
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    } else if (i === fullStars && hasHalfStar) {
      // Half star
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    } else {
      // Empty star
      stars.push(
        <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      );
    }
  }

  return <div className="flex">{stars}</div>;
};

export default ProjectDetails;