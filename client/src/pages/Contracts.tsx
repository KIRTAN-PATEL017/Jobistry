import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, DollarSign, Briefcase } from "lucide-react"

interface Proposal {
  bidAmount: number
  estimatedDays: number
}

interface Project {
  title: string
  description?: string
}

interface Contract {
  _id: string
  status: string
  client: { name: string; email: string }
  freelancer: { name: string; email: string }
  proposal: Proposal
  project: Project
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-50 text-green-700 border border-green-200",
    dotColor: "bg-green-500",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dotColor: "bg-yellow-500",
  },
  completed: {
    label: "Completed",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
    dotColor: "bg-blue-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border border-red-200",
    dotColor: "bg-red-500",
  },
}

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true) // added loading state
  const navigate = useNavigate()

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get("https://jobistry-api.onrender.com/api/contracts", {
          withCredentials: true,
        })
        setContracts(res.data.contracts)
      } catch (error) {
        console.error("Failed to fetch contracts:", error)
        setContracts([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchContracts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading contracts...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">My Contracts</h2>
          <p className="text-gray-600">Manage and track your project contracts</p>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <p className="text-xl text-gray-500 mb-2">No contracts found</p>
            <p className="text-gray-400">Your contracts will appear here once you start working on projects</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {contracts.map((contract, index) => {
                const status = statusConfig[contract.status as keyof typeof statusConfig] || statusConfig.pending

                return (
                  <motion.div
                    key={contract._id}
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white hover:shadow-lg rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden flex flex-col h-full min-h-[400px]"
                  >
                    {/* Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 flex-1 pr-2">
                          {contract.project?.title || "Untitled Project"}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${status.className}`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* Contract Details - This will grow to fill available space */}
                    <div className="p-6 pt-4 space-y-4 mb-6 flex-grow">
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-1">Client</p>
                          <p className="font-semibold text-gray-900 truncate">{contract.client?.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-500 mb-1">Freelancer</p>
                          <p className="font-semibold text-gray-900 truncate">{contract.freelancer?.name}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1">Amount</p>
                            <p className="font-semibold text-emerald-600 truncate">₹{contract.proposal?.bidAmount}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 mb-1">Duration</p>
                            <p className="font-semibold text-purple-600 truncate">
                              {contract.proposal?.estimatedDays} days
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button - This will always be at the bottom */}
                    <div className="p-6 pt-0 mt-auto">
                      <button
                        onClick={() => navigate(`/messages?contractId=${contract._id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
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
  )
}

export default Contracts
