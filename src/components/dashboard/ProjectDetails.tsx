import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Briefcase, User, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

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
  proposals: any[]; // You can define a Proposal interface if needed
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
      return 'bg-yellow-100 text-yellow-800' ;
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const ProjectDetails: React.FC = () => {
  const {projectId} = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isClient = user?.role === 'client';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        await axios.get(`http://localhost:5000/api/projects/${projectId}`, {withCredentials: true})
        .then((res) => {
          setProject(res.data.project);
          console.log(res.data.project)
          setError('');
        })
        .catch(err => console.log(err))
        .finally(() => {
          setLoading(false);
        });

      } catch (err: any) {
        console.error(err);
        setError('Could not load project details');
      } 
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (loading) return <div className="text-center py-20">Loading project details...</div>;
  if (error || !project) return <div className="text-center py-20 text-red-500">{error || 'Project not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto mb-104">
      <div className="mb-6">
        <Link to={`/projects/client/${user?.id}`} className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          &larr; Back
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary-100 text-primary-800 text-xs px-3 py-1 rounded-full">
            {project.category}
          </span>
          <span className="bg-gray-100 text-gray-800 text-xs px-3 py-1 rounded-full">
            Posted {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span className="bg-accent-100 text-accent-800 text-xs px-3 py-1 rounded-full">
            {project.proposals.length} proposals
          </span>

          <span className={getStatusColor(project.status) + " text-xs px-3 py-1 rounded-full"}>
            {project.status}
          </span>
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

        <div className='flex justify-between flex-col md:flex-row'>
          {/* Project Details */}
          <div className="bg-white rounded-xl shadow-sm p-4 my-2 md:w-[49%]">
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
                <Star rating={project.client?.rating || 4.5} />
                <p className="text-sm ml-2">{(project.client?.rating || 4.5).toFixed(1)} rating</p>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="text-gray-500 mr-2" />
                <p className="text-sm">Member since {project.client?.joined || '2023'}</p>
              </div>
              <div className="flex items-center">
                <FileText size={16} className="text-gray-500 mr-2" />
                <p className="text-sm">{project.proposals.length} proposals received</p>
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
      stars.push(<svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>);
    } else if (i === fullStars && hasHalfStar) {
      stars.push(<svg key={i} className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24"><defs><linearGradient id="half" x1="0" x2="100%" y1="0" y2="0"><stop offset="50%" stopColor="#FBBF24" /><stop offset="50%" stopColor="#D1D5DB" /></linearGradient></defs><path fill="url(#half)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>);
    } else {
      stars.push(<svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>);
    }
  }

  return <div className="flex">{stars}</div>;
};

export default ProjectDetails;
