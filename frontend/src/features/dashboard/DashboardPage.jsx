import { useState, useEffect } from 'react'
import {
  Users, UserCheck, UserPlus, TrendingUp, BadgeDollarSign,
  Award, RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getLeadStats } from '../../services/leadService.js'
import { formatCurrency } from '../../utils/formatters.js'
import StatCard from './components/StatCard.jsx'
import StatusChart from './components/StatusChart.jsx'
import Button from '../../components/common/Button.jsx'
import Loader from '../../components/common/Loader.jsx'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const data = await getLeadStats()
      setStats(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  if (loading) return <Loader size="lg" message="Loading dashboard..." className="min-h-[60vh]" />

  const byStatus = stats?.byStatus || {}
  const agentPerformance = stats?.agentPerformance || []
  const commission = stats?.totalCommission ?? (stats?.totalDealAmount ? stats.totalDealAmount * 0.1 : 0)

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="page-title">Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Real-time lead pipeline metrics</p>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchStats}>
          Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={stats?.total ?? 0} icon={Users} color="indigo" />
        <StatCard label="New" value={byStatus.NEW ?? 0} icon={UserPlus} color="blue" />
        <StatCard label="Assigned" value={byStatus.ASSIGNED ?? 0} icon={UserCheck} color="purple" />
        <StatCard label="Interested" value={byStatus.INTERESTED ?? 0} icon={TrendingUp} color="yellow" />
        <StatCard
          label="Converted"
          value={byStatus.CONVERTED ?? 0}
          icon={Award}
          color="green"
        />
        <StatCard
          label="Deal Amount"
          value={formatCurrency(stats?.totalDealAmount)}
          icon={BadgeDollarSign}
          color="emerald"
          subtitle="from conversions"
        />
        <StatCard
          label="Commission"
          value={formatCurrency(commission)}
          icon={BadgeDollarSign}
          color="rose"
          subtitle="estimated 10%"
        />
      </div>

      {/* Charts + Agent Table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Lead Status Breakdown</h3>
          <StatusChart stats={stats} />
        </div>

        {/* Agent Performance Table */}
        <div className="lg:col-span-3 card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Agent Performance</h3>
          {agentPerformance.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No agent data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Agent</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Assigned</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Interested</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Converted</th>
                    <th className="text-right pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Deal Amt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {agentPerformance.map((agent, i) => (
                    <tr key={agent._id || i} className="hover:bg-gray-50/60">
                      <td className="py-3 font-medium text-gray-800">{agent.name || 'Unknown'}</td>
                      <td className="py-3 text-right text-gray-600">{agent.assigned ?? 0}</td>
                      <td className="py-3 text-right text-yellow-600 font-medium">{agent.interested ?? 0}</td>
                      <td className="py-3 text-right text-green-600 font-medium">{agent.converted ?? 0}</td>
                      <td className="py-3 text-right text-gray-700">{formatCurrency(agent.dealAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
