import { useState, useEffect, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { getLeads, exportLeadsExcel } from "../../services/leadService.js";
import { getAgents } from "../../services/agentService.js";

import {
  LEAD_STATUS,
  LEAD_STATUS_LABELS,
  CATEGORY_OPTIONS,
  DEFAULT_PAGE_SIZE,
} from "../../config/constants.js";
import { useModal } from "../../hooks/useModal.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import LeadsTable from "../../components/tables/LeadsTable.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Select from "../../components/common/Select.jsx";
import Loader from "../../components/common/Loader.jsx";
import LeadDetailModal from "./LeadDetailModal.jsx";
import UpdateLeadStatusModal from "./UpdateLeadStatusModal.jsx";
import AssignLeadsModal from "./AssignLeadsModal.jsx";


const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  ...Object.entries(LEAD_STATUS_LABELS).map(([v, l]) => ({
    value: v,
    label: l,
  })),
];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });


  
  const [search, setSearch] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    city: "",
    category: "",
    assignedTo: "",
  });

  const debouncedSearch = useDebounce(search, 400);

  const detailModal = useModal();
  const statusModal = useModal();
  const assignModal = useModal();

  const fetchLeads = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: DEFAULT_PAGE_SIZE,
          ...(filters.status && { status: filters.status }),
          ...(filters.city && { city: filters.city }),
          ...(filters.category && { category: filters.category }),
          ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
        };
        const data = await getLeads(params);
        console.log(data, "data........");
        // Support both { leads, total, totalPages } and array responses
        // const list = Array.isArray(data) ? data : (data.leads || [])
        const list = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.leads)
            ? data.leads
            : Array.isArray(data)
              ? data
              : [];

        setLeads(list);
        console.log(data.totalPages, "----------------")
        setPagination({
          page,
          total: data?.total || list.length,
          totalPages: data?.totalPages || 1,
        });
        setLeads(list);
        setPagination({
          page,
          total: data.total || list.length,
          totalPages: data.totalPages || 1,
        });
      } catch (err) {
        toast.error(err.message || "Failed to load leads");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    fetchLeads(1);
  }, [fetchLeads]);

  // useEffect(() => {
  //   getAgents()
  //     .then((d) => setAgents(d?.agents || d || []))
  //     .catch(() => {})
  // }, [])

  // getAgents()
  // .then((d) => {
  //   const list = d?.data || d?.agents || [];
  //   setAgents(Array.isArray(list) ? list : []);
  // })
  // .catch(() => {});

  useEffect(() => {
    getAgents()
      .then((d) => {
        const list = d?.data || d?.agents || [];
        setAgents(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  //   useEffect(() => {
  //   getAgents()
  //     .then((d) => {
  //       console.log("AGENTS RESPONSE =>", d);
  //       setAgents(d?.agents || d || []);
  //     })
  //     .catch(console.error);
  // }, []);

  const handleExport = async (agentId = null) => {
    setExporting(true);
    try {
      const res = await exportLeadsExcel(agentId);
      downloadBlob(res, `leads_export_${Date.now()}.xlsx`);
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  // Client-side search filter
  const displayedLeads = debouncedSearch
    ? leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          l.phone?.includes(debouncedSearch),
      )
    : leads;

  const agentOptions = [
    { value: "", label: "All Agents" },
    ...agents.map((a) => ({ value: a._id, label: a.name })),
  ];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="page-title">Leads</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {pagination.total} total leads
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            icon={UserPlus}
            onClick={assignModal.open}
          >
            Assign Leads
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            loading={exporting}
            onClick={() => handleExport()}
          >
            Export All
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => fetchLeads(pagination.page)}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Filters</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          <Input
            placeholder="Search name or phone..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-2 xl:col-span-1"
          />
          <Select
            options={STATUS_OPTIONS}
            placeholder="All Statuses"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value }))
            }
          />
          <Input
            placeholder="City"
            value={filters.city}
            onChange={(e) =>
              setFilters((f) => ({ ...f, city: e.target.value }))
            }
          />
          <Select
            options={[
              { value: "", label: "All Categories" },
              ...CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
            ]}
            placeholder="All Categories"
            value={filters.category}
            onChange={(e) =>
              setFilters((f) => ({ ...f, category: e.target.value }))
            }
          />
          <Select
            options={agentOptions}
            placeholder="All Agents"
            value={filters.assignedTo}
            onChange={(e) =>
              setFilters((f) => ({ ...f, assignedTo: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        {loading ? (
          <Loader message="Loading leads..." />
        ) : (
          <div>

          <LeadsTable
            leads={displayedLeads}
            onViewLead={detailModal.open}
            onUpdateStatus={statusModal.open}
          />
          <div>
            </div>

          </div>

        )}

        {/* Pagination */}
        {!loading  && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {pagination.page} of {pagination.totalPages} &middot;{" "}
              {pagination.total} leads
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="secondary"
                size="xs"
                icon={ChevronLeft}
                disabled={pagination.page <= 1}
                onClick={() => fetchLeads(pagination.page - 1)}
              />
              <Button
                variant="secondary"
                size="xs"
                icon={ChevronRight}
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchLeads(pagination.page + 1)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadDetailModal
        isOpen={detailModal.isOpen}
        onClose={detailModal.close}
        lead={detailModal.data}
        onEdit={statusModal.open}
      />
      <UpdateLeadStatusModal
        isOpen={statusModal.isOpen}
        onClose={statusModal.close}
        lead={statusModal.data}
        onUpdated={() => fetchLeads(pagination.page)}
      />
      <AssignLeadsModal
        isOpen={assignModal.isOpen}
        onClose={assignModal.close}
        onAssigned={() => fetchLeads(1)}
      />
    </div>
  );
}
