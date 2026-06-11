import apiClient from './apiClient.js'

/**
 * Trigger Google Maps scraper
 * @param {string} query - e.g., "physiotherapist in Muzaffarnagar"
 * @param {number} maxLeads
 */
export const scrapeGoogleMaps = async (query, maxLeads) => {
  const { data } = await apiClient.post('/scraper/google-maps', { query, maxLeads })
  return data
}
