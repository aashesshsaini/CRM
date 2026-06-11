export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api/v1/";

export const LEAD_STATUS = {
  NEW: "NEW",
  ASSIGNED: "ASSIGNED",
  CONTACTED: "CONTACTED",
  INTERESTED: "INTERESTED",
  NOT_INTERESTED: "NOT_INTERESTED",
  CONVERTED: "CONVERTED",
  LOST: "LOST",
};

export const LEAD_STATUS_LABELS = {
  NEW: "New",
  ASSIGNED: "Assigned",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  NOT_INTERESTED: "Not Interested",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export const LEAD_STATUS_COLORS = {
  NEW: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20",
  ASSIGNED: "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20",
  CONTACTED: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20",
  INTERESTED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20",
  NOT_INTERESTED: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  CONVERTED: "bg-green-50 text-green-800 ring-1 ring-green-600/20",
  LOST: "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20",
};

export const LEAD_STATUS_CHART_COLORS = {
  NEW: "#6366f1",
  ASSIGNED: "#8b5cf6",
  CONTACTED: "#f59e0b",
  INTERESTED: "#10b981",
  NOT_INTERESTED: "#ef4444",
  CONVERTED: "#22c55e",
  LOST: "#94a3b8",
};

export const AGENT_ROLES = {
  CALLER: "CALLER",
  MANAGER: "MANAGER",
  ADMIN: "ADMIN",
};

export const CATEGORY_OPTIONS = [
  "physiotherapist",
  "dentist",
  "doctor",
  "hospital",
  "clinic",
  "gym",
  "yoga",
  "restaurant",
  "hotel",
  "school",
  "college",
  "coaching",
  "lawyer",
  "ca",
  "architect",
  "interior designer",
  "real estate",
  "travel agent",
  "event planner",
  "photographer",
];

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DEFAULT_PAGE_SIZE = 25;
