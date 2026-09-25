import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, RefreshCw, Search, X } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-filter";
import TablePagination from "@/pages/components/common/Pagination";
import API from "@/api";
import {
  LoadingRowsCell,
  TABLE_CLS,
  THEAD_CLS,
  TH_CLS,
  TD_CLS,
} from "../rbac/helpers";
import {
  ActionBadge,
  ActorTypeBadge,
  LogStatusBadge,
  formatLogDate,
  formatLogTime,
  humanise,
  toApiDate,
  toDisplayLog,
} from "./helpers";
import { LogDetails } from "./components/log-details";
import { exportActivityLogsToExcel } from "./components/export-activity-logs";

const COLUMNS = [
  "No.",
  "Module",
  "Sub Module",
  "Action",
  "Title",
  "Description",
  "Record",
  "Performed By",
  "Status",
  "Log Date",
];

const LIMIT = 20;

// Every Select needs a non-empty value for "no filter" — Radix reserves "".
const ANY = "__any__";

const EMPTY_FILTERS = {
  module: ANY,
  sub_module: ANY,
  action: ANY,
  actor_name: ANY,
  status: ANY,
};

const STATUS_OPTIONS = [
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

/**
 * Activity Logs — the trail of who did what, across the whole dashboard.
 *
 * Read-only: rows are written server-side and there is no endpoint that can
 * change one, so this page only ever lists, filters and exports.
 *
 * Filtering and paging are done by the server. The trail grows without bound,
 * so fetching it all and slicing in the browser would stop working within
 * weeks of going live.
 */
export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  // "nothing came back" and "nothing has happened yet" look identical in an
  // empty table but mean opposite things — one is a fault to chase, the other
  // is fine. Tracked so the empty state can say which.
  const [loadFailed, setLoadFailed] = useState(false);

  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  // Two search values: what the box shows, and what the server was last asked
  // for. Without the split, every keystroke is a request.
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [options, setOptions] = useState({
    modules: [],
    sub_modules: [],
    actions: [],
    actors: [],
  });

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLog, setDetailLog] = useState(null);

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Only a completed range is worth sending: a half-picked one would silently
  // narrow the table to a single day while the admin is still choosing.
  const appliedRange = useMemo(
    () => ({
      from: dateRange?.from && dateRange?.to ? toApiDate(dateRange.from) : "",
      to: dateRange?.from && dateRange?.to ? toApiDate(dateRange.to) : "",
    }),
    [dateRange]
  );

  const query = useMemo(() => {
    const picked = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value && value !== ANY)
    );
    return { ...picked, ...appliedRange, search };
  }, [filters, appliedRange, search]);

  // The response of a slow request must not overwrite a newer one's — the
  // admin types fast and the trail can be big.
  const requestId = useRef(0);

  const fetchLogs = useCallback(
    async (targetPage) => {
      const id = ++requestId.current;
      try {
        setLoading(true);
        const res = await API.activityLogs.List({
          ...query,
          page: targetPage,
          limit: LIMIT,
        });
        if (id !== requestId.current) return;
        if (res) {
          setLoadFailed(false);
          setLogs((res.logs || []).map(toDisplayLog));
          setTotal(res.pagination?.total || 0);
          setTotalPages(res.pagination?.total_pages || 1);
        } else {
          // `handleResponse` already toasted the reason; the table must not go
          // on claiming there is simply no activity.
          setLoadFailed(true);
          setLogs([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [query]
  );

  // Any filter change puts us back on page 1 — page 4 of the old result set
  // is meaningless against the new one.
  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    fetchLogs(page);
  }, [fetchLogs, page]);

  useEffect(() => {
    const loadOptions = async () => {
      const res = await API.activityLogs.Filters();
      if (res) {
        setOptions({
          modules: res.modules || [],
          sub_modules: res.sub_modules || [],
          actions: res.actions || [],
          actors: res.actors || [],
        });
      }
    };
    loadOptions();
  }, []);

  const setFilter = (key) => (value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const filtersActive =
    Boolean(search) ||
    Boolean(appliedRange.from) ||
    Object.values(filters).some((value) => value !== ANY);

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setDateRange({ from: undefined, to: undefined });
    setSearchInput("");
    setSearch("");
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      // Exports the whole filtered result, not the page on screen.
      const res = await API.activityLogs.Export(query);
      if (!res?.logs?.length) {
        toast.warning("Nothing to export", {
          description: "No activity matches the current filters.",
        });
        return;
      }

      await exportActivityLogsToExcel(res.logs, appliedRange);

      toast.success(
        `Exported ${res.count} log${res.count === 1 ? "" : "s"}`,
        res.truncated
          ? {
              description: `Capped at ${res.limit} rows — narrow the date range for the rest.`,
            }
          : undefined
      );
    } catch {
      toast.error("Export failed", { description: "Please try again." });
    } finally {
      setExporting(false);
    }
  };

  const openDetails = (log) => {
    setDetailLog(log);
    setDetailOpen(true);
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/dashboard" className="flex items-center text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Activity Logs</p>
          <span className="text-blue-600 font-semibold">{total}</span>
        </div>
      </div>

      <p className="text-xs text-[#7F7F7F] -mt-1">
        Every change made across the dashboard — who did it, what they touched,
        and whether it went through.
      </p>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
          <DatePickerWithRange
            value={dateRange}
            onDateChange={setDateRange}
            toDate={new Date()}
            placeholder="All dates"
            triggerClassName="h-9"
          />

          <Select value={filters.module} onValueChange={setFilter("module")}>
            <SelectTrigger className="w-full md:w-[170px] h-9">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All Modules</SelectItem>
              {options.modules.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.sub_module}
            onValueChange={setFilter("sub_module")}
          >
            <SelectTrigger className="w-full md:w-[160px] h-9">
              <SelectValue placeholder="All Sub Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All Sub Modules</SelectItem>
              {options.sub_modules.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.action} onValueChange={setFilter("action")}>
            <SelectTrigger className="w-full md:w-[145px] h-9">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All Actions</SelectItem>
              {options.actions.map((item) => (
                <SelectItem key={item} value={item}>
                  {humanise(item)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.actor_name}
            onValueChange={setFilter("actor_name")}
          >
            <SelectTrigger className="w-full md:w-[170px] h-9">
              <SelectValue placeholder="Anyone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Anyone</SelectItem>
              {options.actors.map((actor) => (
                <SelectItem key={actor.name} value={actor.name}>
                  {actor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={setFilter("status")}>
            <SelectTrigger className="w-full md:w-[125px] h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All Status</SelectItem>
              {STATUS_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {filtersActive && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-9 text-xs text-[#7F7F7F] hover:text-[#323232]"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search activity..."
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="pl-10 pr-4 h-9 rounded-md border border-gray-300 w-full md:w-[220px]"
            />
          </div>

          <Button
            onClick={() => fetchLogs(page)}
            variant="outline"
            className="flex items-center gap-2 h-9 whitespace-nowrap"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={handleExport}
            disabled={exporting || total === 0}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 h-9 whitespace-nowrap"
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      <div className="w-full h-[calc(100%-135px)] overflow-y-auto eme-scroll">
        {loading ? (
          <LoadingRowsCell label="Loading activity…" />
        ) : (
          <>
            <Table className={TABLE_CLS}>
              <TableHeader className={THEAD_CLS}>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableHead key={col} className={TH_CLS}>
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center py-10 text-gray-500 text-sm"
                    >
                      {loadFailed ? (
                        <span className="text-red-600">
                          Couldn't load activity — the server didn't answer.
                          Check that the backend is deployed and reachable, then
                          press Refresh.
                        </span>
                      ) : filtersActive ? (
                        "No activity matches these filters."
                      ) : (
                        "No activity recorded yet."
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, index) => (
                    <TableRow
                      key={log.id}
                      onClick={() => openDetails(log)}
                      className="cursor-pointer"
                      title="View full detail"
                    >
                      <TableCell className={`${TD_CLS} align-top`}>
                        {(page - 1) * LIMIT + index + 1}
                      </TableCell>
                      <TableCell
                        className={`${TD_CLS} align-top font-medium text-[#323232] whitespace-nowrap`}
                      >
                        {log.display_module}
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top whitespace-nowrap`}>
                        {log.display_sub_module || "—"}
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top`}>
                        <ActionBadge action={log.display_action} />
                      </TableCell>
                      <TableCell
                        className={`${TD_CLS} align-top whitespace-normal min-w-[150px] max-w-[210px]`}
                      >
                        {log.display_title || "—"}
                      </TableCell>
                      <TableCell
                        className={`${TD_CLS} align-top whitespace-normal min-w-[260px] max-w-[380px]`}
                      >
                        <span className="line-clamp-2">{log.display_description}</span>
                      </TableCell>
                      <TableCell
                        className={`${TD_CLS} align-top whitespace-normal max-w-[180px]`}
                      >
                        {log.entity_label || (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top`}>
                        <div className="text-[#323232]">{log.display_actor_name}</div>
                        <ActorTypeBadge actorType={log.actor_type} actorRole={log.actor_role} />
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top`}>
                        <LogStatusBadge status={log.status} />
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top whitespace-nowrap`}>
                        <div>{formatLogDate(log.created_at)}</div>
                        <div className="text-[11px] text-gray-400">
                          {formatLogTime(log.created_at)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <TablePagination
                currentPage={page}
                totalPages={totalPages}
                setCurrentPage={setPage}
              />
            )}
          </>
        )}
      </div>

      <LogDetails open={detailOpen} setOpen={setDetailOpen} log={detailLog} />
    </>
  );
}
