/**
 * Format a number as Indian currency (₹)
 */
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format ISO date string to readable date
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format phone number as WhatsApp link
 */
export const getWhatsAppLink = (phone) => {
  if (!phone) return null
  const cleaned = phone.replace(/\D/g, '')
  const withCountry = cleaned.startsWith('91') ? cleaned : `91${cleaned}`
  return `https://wa.me/${withCountry}`
}

/**
 * Truncate a string to a max length
 */
export const truncate = (str, maxLen = 40) => {
  if (!str) return '—'
  return str.length > maxLen ? `${str.slice(0, maxLen)}...` : str
}

/**
 * Capitalize first letter of each word
 */
export const titleCase = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

/**
 * Trigger a file download from a Blob response
 */
export const downloadBlob = (response, filename = 'export.xlsx') => {
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
