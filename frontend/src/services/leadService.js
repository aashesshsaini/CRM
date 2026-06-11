import apiClient from './apiClient.js'

/**
 * Fetch paginated leads with optional filters
 */
export const getLeads = async (params = {}) => {
  const { data } = await apiClient.get('/leads', { params })
  return data
}

/**
 * Fetch lead stats for the dashboard
 */
export const getLeadStats = async () => {
  const { data } = await apiClient.get('/leads/stats')
  return data
}

/**
 * Update a lead's status with optional remarks, follow-up date, and deal amount
 */
export const updateLeadStatus = async (id, payload) => {
  const { data } = await apiClient.patch(`/leads/${id}/status`, payload)
  return data
}

/**
 * Assign unassigned leads to an agent
 */
export const assignLeads = async (payload) => {
  const { data } = await apiClient.post('/leads/assign', payload)
  return data
}

/**
 * Download exported Excel file — returns a Blob
 */
export const exportLeadsExcel = async (agentId = null) => {
  const params = agentId ? { agentId } : {}
  const response = await apiClient.get('/leads/export/excel', {
    params,
    responseType: 'blob',
  })
  return response
}
