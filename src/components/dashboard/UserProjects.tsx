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
  proposals: string[];
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
        await axios.get(`http://localhost:5000/api/projects/client/${userId}`, {
          withCredentials: true,
        })
        .then((res) => {
          setProjects(res.data.projects || []);
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
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
              className="block bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg p-4"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div className="mb-3 md:mb-0">
                  <h3 className="font-medium text-2xl">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.category}</p>
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
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserProjects;
