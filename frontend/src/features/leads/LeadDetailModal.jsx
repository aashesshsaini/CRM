import { ExternalLink, MessageCircle, MapPin, Globe, Phone, Tag, User, Calendar, DollarSign, FileText } from 'lucide-react'
import Modal from '../../components/common/Modal.jsx'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import { formatDate, formatCurrency, getWhatsAppLink } from '../../utils/formatters.js'

function InfoRow({ icon: Icon, label, value, link }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:underline break-all inline-flex items-center gap-1">
            {value} <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="text-sm text-gray-800 break-words">{value}</p>
        )}
      </div>
    </div>
  )
}

export default function LeadDetailModal({ isOpen, onClose, lead, onEdit }) {
  if (!lead) return null
  const waLink = getWhatsAppLink(lead.phone)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Close</Button>
          <Button onClick={() => { onClose(); onEdit?.(lead) }}>Update Status</Button>
        </>
      }
    >
      <div className="space-y-1">
        {/* Header badge */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{lead.name || 'Unknown Business'}</h3>
          <Badge status={lead.status} />
        </div>

        <InfoRow icon={Phone} label="Phone" value={lead.phone}
          link={waLink ? waLink : undefined} />
        <InfoRow icon={MapPin} label="Address" value={lead.address} />
        <InfoRow icon={Tag} label="City" value={lead.city} />
        <InfoRow icon={Tag} label="Category" value={lead.category} />
        <InfoRow icon={Globe} label="Website" value={lead.website}
          link={lead.website ? (lead.website.startsWith('http') ? lead.website : `https://${lead.website}`) : null} />
        <InfoRow icon={MapPin} label="Google Maps" value={lead.googleMapsUrl ? 'View on Maps' : null}
          link={lead.googleMapsUrl} />
        <InfoRow icon={User} label="Assigned To" value={lead.assignedTo?.name} />
        <InfoRow icon={FileText} label="Remarks" value={lead.remarks} />
        <InfoRow icon={Calendar} label="Follow-up Date" value={formatDate(lead.followUpDate)} />
        {lead.dealAmount && (
          <InfoRow icon={DollarSign} label="Deal Amount" value={formatCurrency(lead.dealAmount)} />
        )}
        <InfoRow icon={Calendar} label="Created At" value={formatDate(lead.createdAt)} />
      </div>
    </Modal>
  )
}
