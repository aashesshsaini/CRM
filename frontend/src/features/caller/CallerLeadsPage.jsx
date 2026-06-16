import { useState, useEffect } from 'react'
import { LogOut, MessageCircle, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { getLeads } from '../../services/leadService.js'
import { useAuth } from '../../app/AuthContext.jsx'
import Badge from '../../components/common/Badge.jsx'
import { formatDate, getWhatsAppLink } from '../../utils/formatters.js'
import { useModal } from '../../hooks/useModal.js'
import UpdateLeadStatusModal from '../leads/UpdateLeadStatusModal.jsx'
import Loader from '../../components/common/Loader.jsx'
import { LEAD_STATUS } from '../../config/constants.js'

export default function CallerLeadsPage() {
  const navigate = useNavigate()
  const { agent, logout } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const statusModal = useModal()

  const fetchLeads = async () => {
    if (!agent?._id) return
    setLoading(true)
    try {
      const data = await getLeads({ assignedTo: agent._id, limit: 500 })
      setLeads(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      toast.error(err.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [agent?._id])

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  if (!agent) return null

  const statCalled = leads.filter((l) => l.status === LEAD_STATUS.CALLED).length
  const statInterested = leads.filter((l) => l.status === LEAD_STATUS.INTERESTED).length
  const statConverted = leads.filter((l) => l.status === LEAD_STATUS.CONVERTED).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Leads</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Welcome, <strong>{agent.name}</strong>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold uppercase">Total Assigned</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{leads.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold uppercase">Called</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statCalled}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold uppercase">Interested</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{statInterested}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold uppercase">Converted</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{statConverted}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <Loader message="Loading your leads..." />
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="font-medium">No leads assigned yet</p>
              <p className="text-sm mt-1">Check back later for new assignments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Business', 'Contact', 'Location', 'Status', 'Follow-up', 'Action'].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => {
                    const waLink = getWhatsAppLink(lead.phone)
                    return (
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{lead.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500 mt-1">{lead.address}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-mono text-sm text-gray-700">{lead.phone}</div>
                          <div className="flex gap-3 mt-2">
                            {waLink && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            )}
                            {lead.website && (
                              <a
                                href={
                                  lead.website.startsWith('http')
                                    ? lead.website
                                    : `https://${lead.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                              >
                                <Globe className="w-3.5 h-3.5" />
                                Website
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{lead.city || '—'}</div>
                          <div className="text-xs text-gray-500 capitalize">{lead.category || '—'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={lead.status} />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(lead.followUpDate)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => statusModal.open(lead)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 text-sm font-medium transition-colors"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <UpdateLeadStatusModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.close}
        lead={statusModal.data}
        onUpdated={fetchLeads}
      />
    </div>
  )
}
