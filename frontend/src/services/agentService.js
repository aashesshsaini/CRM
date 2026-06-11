import apiClient from "./apiClient.js";

/**
 * Fetch all agents
 */
export const getAgents = async () => {
  const { data } = await apiClient.get("/agents");
  return data;
};

/**
 * Create a new agent
 */
export const createAgent = async (payload) => {
  const { data } = await apiClient.post("/agents", payload);
  return data;
};
