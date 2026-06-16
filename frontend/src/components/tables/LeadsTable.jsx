import { ExternalLink, MessageCircle, MapPin, Globe, Edit2, Eye } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import EmptyState from '../common/EmptyState.jsx'
import { formatDate, getWhatsAppLink, truncate } from '../../utils/formatters.js'

export default function LeadsTable({ leads = [], onViewLead, onUpdateStatus, loading }) {
  if (!loading && leads.length === 0) {
    return (
      <EmptyState
        title="No leads found"
        description="Try adjusting your filters or scrape new leads to get started."
      />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50">
            {['Business', 'Phone', 'City / Category', 'Assigned To', 'Status', 'Follow-up', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {leads.map((lead) => {
            const waLink = getWhatsAppLink(lead.phone)
            return (
              <tr key={lead._id} className="hover:bg-gray-50/70 transition-colors">
                {/* Business Name */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                      {lead.name || '—'}
                    </span>
                    {lead.address && (
                      <span className="text-xs text-gray-400 max-w-[200px] truncate">{lead.address}</span>
                    )}
                  </div>
                </td>

                {/* Phone + Links */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700 font-mono">{lead.phone || '—'}</span>
                    <div className="flex items-center gap-2">
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          <MessageCircle className="w-3 h-3" /> WA
                        </a>
                      )}
                      {lead.website && (
                        <a
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          <Globe className="w-3 h-3" /> Web
                        </a>
                      )}
                      {lead.mapLink && (
                        <a
                          href={lead.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-orange-500 hover:text-orange-600 font-medium"
                        >
                          <MapPin className="w-3 h-3" /> Map
                        </a>
                      )}
                    </div>
                  </div>
                </td>

                {/* City / Category */}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm text-gray-700">{lead.city || '—'}</span>
                    <span className="text-xs text-gray-400 capitalize">{lead.category || '—'}</span>
                  </div>
                </td>

                {/* Assigned To */}
                <td className="px-4 py-3">
                  {lead.assignedTo?.name ? (
                    <span className="text-sm text-gray-700">{lead.assignedTo.name}</span>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <Badge status={lead.status} />
                </td>

                {/* Follow-up */}
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{formatDate(lead.followUpDate)}</span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={Eye}
                      onClick={() => onViewLead?.(lead)}
                      title="View details"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={Edit2}
                      onClick={() => onUpdateStatus?.(lead)}
                      title="Update status"
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
