import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Proposal {
  _id: string;
  project: {
    _id: string;
    title: string;
  };
  bidAmount: number;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
}

const UserProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const {user} = useAuth()

  useEffect(() => {
    const fetchUserProposals = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/proposals/${user?.id}`, {
          withCredentials: true,
        });
        setProposals(res.data.proposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProposals();
  }, []);

  if (loading) return <div className="text-center p-4">Loading proposals...</div>;

  if (proposals.length === 0) return <div className="text-center p-4">No proposals submitted yet.</div>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">My Proposals</h2>
      <div className="grid gap-4">
        {proposals.map((proposal) => (
          <div
            key={proposal._id}
            className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white"
          >
            <h3 className="text-lg font-semibold text-blue-600">
              Project: {proposal.project.title}
            </h3>
            <p className="mt-2">
              <strong>Bid Amount:</strong> ${proposal.bidAmount}
            </p>
            <p>
              <strong>Estimated Days:</strong> {proposal.estimatedDays} day(s)
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`font-semibold ${
                  proposal.status === 'accepted'
                    ? 'text-green-600'
                    : proposal.status === 'rejected'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}
              >
                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProposals;
