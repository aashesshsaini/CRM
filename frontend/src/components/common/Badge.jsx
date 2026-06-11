import { LEAD_STATUS_COLORS, LEAD_STATUS_LABELS } from '../../config/constants.js'

export default function Badge({ status, className = '' }) {
  const colorClass = LEAD_STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
  const label = LEAD_STATUS_LABELS[status] || status

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${colorClass} ${className}
      `}
    >
      {label}
    </span>
  )
}
