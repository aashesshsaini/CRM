import { useState, useEffect } from 'react'
import { UserPlus, Download, Phone, Shield, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAgents } from '../../services/agentService.js'
import { exportLeadsExcel } from '../../services/leadService.js'
import { downloadBlob } from '../../utils/formatters.js'
import { useModal } from '../../hooks/useModal.js'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import CreateAgentModal from './CreateAgentModal.jsx'

const roleColor = {
  CALLER: 'bg-blue-50 text-blue-700',
  MANAGER: 'bg-purple-50 text-purple-700',
  ADMIN: 'bg-indigo-50 text-indigo-700',
}

export default function AgentsPage() {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [exportingId, setExportingId] = useState(null)
  const modal = useModal()

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const data = await getAgents()
      // setAgents(data?.agents || data || [])
      const list = data?.data || data?.agents || [];
setAgents(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.message || 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAgents() }, [])

  const handleExport = async (agentId, agentName) => {
    setExportingId(agentId)
    try {
      const res = await exportLeadsExcel(agentId)
      downloadBlob(res, `leads_${agentName}_${Date.now()}.xlsx`)
      toast.success('Export downloaded')
    } catch (err) {
      toast.error(err.message || 'Export failed')
    } finally {
      setExportingId(null)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Agents</h2>
          <p className="text-sm text-gray-500 mt-0.5">{agents.length} registered agents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchAgents}>Refresh</Button>
          <Button size="sm" icon={UserPlus} onClick={modal.open}>Add Agent</Button>
        </div>
      </div>

      {/* Agents grid */}
      {loading ? (
        <Loader message="Loading agents..." />
      ) : agents.length === 0 ? (
        <EmptyState
          title="No agents yet"
          description="Add your first agent to start assigning leads."
          action={<Button icon={UserPlus} onClick={modal.open}>Add Agent</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents?.map((agent) => (
            <div key={agent._id} className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              {/* Avatar + Name */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-base font-bold shrink-0">
                  {(agent.name || '?')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{agent.name}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${roleColor[agent.role] || 'bg-gray-100 text-gray-600'}`}>
                    {agent.role}
                  </span>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-mono">{agent.phone || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className={agent.isActive !== false ? 'text-green-600 font-medium' : 'text-red-500'}>
                    {agent.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Export button */}
              <Button
                variant="secondary"
                size="xs"
                icon={Download}
                loading={exportingId === agent._id}
                onClick={() => handleExport(agent._id, agent.name)}
                className="mt-auto self-start"
              >
                Export Leads
              </Button>
            </div>
          ))}
        </div>
      )}

      <CreateAgentModal
        isOpen={modal.isOpen}
        onClose={modal.close}
        onCreated={fetchAgents}
      />
    </div>
  )
}
