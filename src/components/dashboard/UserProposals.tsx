import type React from "react"
import { useEffect, useState } from "react"
import { Calendar, DollarSign, FileText } from "lucide-react"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
interface Proposal {
  _id: string
  project: {
    _id: string
    title: string
  }
  bidAmount: number
  estimatedDays: number
  status: "pending" | "accepted" | "rejected"
}


const UserProposals: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const {user} = useAuth();

  useEffect(() => {
    const fetchUserProposals = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/proposals/${user?.id}`, {
          withCredentials: true,
        });
        setProposals(res.data.proposals);

      } catch (error) {
        console.error("Error fetching proposals:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProposals()
  }, [])

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "accepted":
        return {
          className: "bg-green-50 text-green-700 border border-green-200",
          dotColor: "bg-green-500",
        }
      case "rejected":
        return {
          className: "bg-red-50 text-red-700 border border-red-200",
          dotColor: "bg-red-500",
        }
      default:
        return {
          className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
          dotColor: "bg-yellow-500",
        }
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600 text-lg">Loading proposals...</p>
      </div>
    )

  if (proposals.length === 0)
    return (
      <div className="text-center py-16">
        <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <p className="text-xl text-gray-500 mb-2">No proposals submitted yet</p>
        <p className="text-gray-400">Your submitted proposals will appear here</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2">My Proposals</h2>
          <p className="text-gray-600">Track the status of your submitted project proposals</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {proposals.map((proposal) => {
            const statusConfig = getStatusConfig(proposal.status)

            return (
              <div
                key={proposal._id}
                className="bg-white hover:shadow-lg rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors flex-1 pr-4">
                      {proposal.project.title}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusConfig.className}`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Proposal Details */}
                <div className="p-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Bid Amount</p>
                        <p className="text-lg font-semibold text-emerald-600">${proposal.bidAmount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Estimated Duration</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {proposal.estimatedDays} day{proposal.estimatedDays !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserProposals
