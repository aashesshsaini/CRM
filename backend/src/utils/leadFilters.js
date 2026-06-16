function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildLeadFilters({ status, city, category, assignedTo } = {}) {
  const filter = {};

  if (status) filter.status = status;
  if (city) filter.city = new RegExp(escapeRegex(city), "i");
  if (category) filter.category = new RegExp(escapeRegex(category), "i");
  if (assignedTo) filter.assignedTo = assignedTo;

  return filter;
}

module.exports = { buildLeadFilters, escapeRegex };
