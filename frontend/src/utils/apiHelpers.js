export const parseApiList = (response) => {
  const list = response?.data ?? response?.agents ?? response
  return Array.isArray(list) ? list : []
}

export const parseApiData = (response) => response?.data ?? response
