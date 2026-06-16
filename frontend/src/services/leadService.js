import apiClient from './apiClient.js'
import { parseApiData } from '../utils/apiHelpers.js'

export const getLeads = async (params = {}) => {
  const { data } = await apiClient.get('/leads', { params })
  return data
}

export const getLeadStats = async () => {
  const { data } = await apiClient.get('/leads/stats')
  return parseApiData(data)
}

export const updateLeadStatus = async (id, payload) => {
  const { data } = await apiClient.patch(`/leads/${id}/status`, payload)
  return data
}

export const assignLeads = async (payload) => {
  const { data } = await apiClient.post('/leads/assign', payload)
  return data
}

export const exportLeadsExcel = async (agentId = null) => {
  const params = agentId ? { agentId } : {}
  const response = await apiClient.get('/leads/export/excel', {
    params,
    responseType: 'blob',
  })
  return response
}
