import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { motion } from 'framer-motion';

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
  proposals: string[]; // You could also make this Proposal[] if needed
  selectedProposal?: {
    _id: string;
    bidAmount: number;
    coverLetter: string;
    estimatedDays: number;
    freelancer: string; // or Freelancer if populated
    status: string;
  };
  client: {
    _id: string;
    name: string;
    email: string;
    rating: number;
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
      return 'bg-gray-200 text-gray-700';
  }
};

const UserProjects: React.FC = () => {
  const { userId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`https://jobistry-api.onrender.com/api/projects/client/${userId}`, {
          withCredentials: true,
        })
        console.log(res.data.projects);
        setProjects(res.data.projects || []);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-600">
        <Loader className="animate-spin mr-2" />
        Loading projects...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center py-10">{error}</div>;
  }

  if (projects.length === 0) {
    return <div className="text-gray-500 text-center py-10">No projects found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Projects</h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/projects/${project._id}`}
              className="group block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden my-6"
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <h4 className='text-base font-medium mb-2'>{project.category}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 truncate-2-lines">
                      {project.description}
                    </p>
                  </div>
                  <span
                    className={`ml-4 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Footer */}
              <div className="p-6 pt-4">
                <div className="flex items-center justify-between">
                  {/* Client Info */}
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">{project.client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{project.client.name}</p>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(project.client.rating) ? "text-yellow-400" : "text-gray-300"
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="text-center px-2">
                      <p className="font-semibold text-gray-900">{project.proposals.length}</p>
                      <p className="text-xs">Proposals</p>
                    </div>
                    <div className="text-center px-2">
                      <p className="font-semibold text-green-600">
                        ${project.budget.min} - ${project.budget.max}
                      </p>
                      <p className="text-xs">Budget</p>
                    </div>
                    <div className="text-center px-2">
                      <p className="font-semibold text-gray-900">
                        {new Date(project.deadline).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs">Deadline</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserProjects;
