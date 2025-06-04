import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Calendar, DollarSign, User, Briefcase } from "lucide-react"

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

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotColor: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    dotColor: "bg-amber-500",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dotColor: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
    dotColor: "bg-red-500",
  },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">My Contracts</h2>
          <p className="text-slate-600">Manage and track your project contracts</p>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="mx-auto h-16 w-16 text-slate-300 mb-4" />
            <p className="text-xl text-slate-500 mb-2">No contracts found</p>
            <p className="text-slate-400">Your contracts will appear here once you start working on projects</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {contracts.map((contract, index) => {
                const status = statusConfig[contract.status as keyof typeof statusConfig] || statusConfig.pending

                return (
                  <motion.div
                    key={contract._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-3xl p-6 border border-white/50 hover:border-blue-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full min-h-[400px]"
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1 pr-2">
                          {contract.project?.title || "Untitled Project"}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 ${status.className}`}
                        >
                          <div className={`w-2 h-2 rounded-full ${status.dotColor}`} />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    {/* Contract Details - This will grow to fill available space */}
                    <div className="space-y-4 mb-6 flex-grow">
                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg flex-shrink-0">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Client</p>
                          <p className="font-semibold text-slate-800 truncate">{contract.client?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-slate-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-lg flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Freelancer</p>
                          <p className="font-semibold text-slate-800 truncate">{contract.freelancer?.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg flex-shrink-0">
                            <DollarSign className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Amount</p>
                            <p className="font-bold text-green-600 truncate">₹{contract.proposal?.bidAmount}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg flex-shrink-0">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Duration</p>
                            <p className="font-bold text-purple-600 truncate">
                              {contract.proposal?.estimatedDays} days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button - This will always be at the bottom */}
                    <div className="mt-auto">
                      <button
                        onClick={() => navigate(`/messages?contractId=${contract._id}`)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group-hover:scale-[1.02]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Send Message
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contracts;
