import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  name: string;
  email: string;
}

interface Proposal {
  bidAmount: number;
  estimatedDays: number;
}

interface Project {
  title: string;
  description?: string;
}

interface Contract {
  _id: string;
  status: string;
  client: User;
  freelancer: User;
  proposal: Proposal;
  project: Project;
}

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/contracts', {
          withCredentials: true,
        });
        setContracts(res.data.contracts);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
        setContracts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContracts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading contracts...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Contracts</h2>

      {contracts.length === 0 ? (
        <p className="text-gray-500">No contracts found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {contracts.map((contract, index) => (
              <motion.div
                key={contract._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white shadow-md rounded-2xl p-5 border border-gray-100"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-blue-600">
                    {contract.project?.title || 'Untitled Project'}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">Status: {contract.status}</p>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Client:</strong> {contract.client?.name}
                  </p>
                  <p>
                    <strong>Freelancer:</strong> {contract.freelancer?.name}
                  </p>
                  <p>
                    <strong>Bid Amount:</strong> ₹{contract.proposal?.bidAmount}
                  </p>
                  <p>
                    <strong>Estimated Days:</strong> {contract.proposal?.estimatedDays}
                  </p>
                </div>

                <div className="mt-5">
                  <button
                    onClick={() => navigate(`/messages?contractId=${contract._id}`)}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Message
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Contracts;
