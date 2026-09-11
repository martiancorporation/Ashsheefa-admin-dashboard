import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TablePagination from "@/pages/components/common/Pagination";
import { toast } from "sonner";
import API from "@/api";
import useAuthDataStore from "@/store/authStore";
import {
  unwrap,
  StatusBadge,
  AccessActionBadge,
  formatDateTime,
  LoadingRowsCell,
  TABLE_CLS,
  THEAD_CLS,
  TH_CLS,
  TD_CLS,
} from "../rbac/helpers";

const COLUMNS = [
  "No.",
  "Resource",
  "Requested Date & Time",
  "Status",
  "Actions",
];
const HISTORY_COLUMNS = ["No.", "Resource", "Action", "By", "Date & Time"];

// Drawers that are always visible to everyone are not requestable.
const ALWAYS_VISIBLE = new Set(["settings"]);

const LIMIT = 10;

/**
 * A non-superadmin admin's own drawer-access requests, plus the history of
 * grants/revokes a superadmin has made for them.
 *
 * Reached only when SHOW_PERMISSIONS_DRAWER is true in src/pages/components/common/Sidebar.jsx.
 */
export default function RequestAccessPage() {
  const authData = useAuthDataStore((state) => state.authData);

  const [catalog, setCatalog] = useState([]);
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedKey, setSelectedKey] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchCatalog = async () => {
    const res = await API.permissions.GetCatalog();
    if (res) setCatalog(res.permissions || []);
  };

  const fetchRequests = async (p = page) => {
    try {
      setLoading(true);
      const res = await API.permissions.GetMyRequests(p, LIMIT);
      if (res) {
        setRequests(res.requests || []);
        setTotalPages(res.pagination?.total_pages || 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (p = historyPage) => {
    try {
      setHistoryLoading(true);
      const res = await API.permissions.GetMyHistory(p, LIMIT);
      if (res) {
        setHistory(res.history || []);
        setHistoryTotalPages(res.pagination?.total_pages || 1);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    fetchRequests(page);
  }, [page]);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [historyPage]);

  // Requestable = catalog minus already-granted minus pending.
  const grantedKeys = useMemo(
    () => new Set(authData?.permissions || []),
    [authData?.permissions]
  );
  const pendingKeys = useMemo(
    () =>
      new Set(
        requests
          .filter((r) => r.status === "pending")
          .map((r) => r.permission_key)
      ),
    [requests]
  );
  const availableDrawers = useMemo(
    () =>
      catalog.filter(
        (c) =>
          !ALWAYS_VISIBLE.has(c.permission_key) &&
          !grantedKeys.has(c.permission_key) &&
          !pendingKeys.has(c.permission_key)
      ),
    [catalog, grantedKeys, pendingKeys]
  );

  const handleSubmit = async () => {
    if (!selectedKey) return;
    try {
      setSubmitting(true);
      const res = unwrap(
        await API.permissions.RequestAccess({
          permission_key: selectedKey,
          reason: reason.trim() || undefined,
        })
      );
      if (res?.request) {
        toast.success("Access request submitted");
        setSelectedKey("");
        setReason("");
        setPage(1);
        fetchRequests(1);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async (id) => {
    const res = unwrap(await API.permissions.WithdrawRequest(id));
    if (res?.request) {
      toast.success("Request withdrawn");
      fetchRequests(page);
    }
  };

  return (
    <>
      <div className="w-full flex items-center space-x-2">
        <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
        <p className="text-[#4B4B4B] font-medium">Request Access</p>
      </div>

      <div className="w-full h-[calc(100%-30px)] overflow-y-auto eme-scroll space-y-6">
        {/* Request form */}
        <div className="border border-gray-300 rounded-md p-4 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              Request Drawer Access
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              Ask a superadmin for access to a drawer. Your request appears
              below and can be withdrawn while pending.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#7F7F7F] mb-1">
                Drawer
              </label>
              <Select value={selectedKey} onValueChange={setSelectedKey}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a drawer…" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrawers.map((d) => (
                    <SelectItem key={d.permission_key} value={d.permission_key}>
                      {d.permission_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-[#7F7F7F] mb-1">
                Reason (optional)
              </label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why do you need this access?"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!selectedKey || submitting}
              className="h-9 px-6 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              {submitting ? "Requesting…" : "Request Access"}
            </Button>
          </div>

          {availableDrawers.length === 0 && (
            <p className="text-xs text-gray-400">
              No drawers available to request — you either have access or a
              pending request for all of them.
            </p>
          )}
        </div>

        {/* My requests */}
        {loading ? (
          <LoadingRowsCell label="Loading requests…" />
        ) : (
          <>
            <Table className={TABLE_CLS}>
              <TableHeader className={THEAD_CLS}>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableHead
                      key={col}
                      className={`${TH_CLS} ${
                        col === "Actions" ? "text-center" : ""
                      }`}
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center py-10 text-gray-500 text-sm"
                    >
                      No access requests yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell className={TD_CLS}>
                        {(page - 1) * LIMIT + index + 1}
                      </TableCell>
                      <TableCell className={TD_CLS}>
                        {item.permission_label || item.permission_key || "-"}
                      </TableCell>
                      <TableCell className={TD_CLS}>
                        {formatDateTime(item.created_at)}
                      </TableCell>
                      <TableCell className={TD_CLS}>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className={`${TD_CLS} text-center`}>
                        {item.status === "pending" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => handleWithdraw(item.id)}
                          >
                            Withdraw
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
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

        {/* Access history (read-only) — grants/revokes made by a superadmin */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              Access History
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              A record of drawers granted or revoked for you by a superadmin.
            </p>
          </div>

          {historyLoading ? (
            <LoadingRowsCell label="Loading history…" />
          ) : (
            <>
              <Table className={TABLE_CLS}>
                <TableHeader className={THEAD_CLS}>
                  <TableRow>
                    {HISTORY_COLUMNS.map((col) => (
                      <TableHead key={col} className={TH_CLS}>
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={HISTORY_COLUMNS.length}
                        className="text-center py-10 text-gray-500 text-sm"
                      >
                        No access changes yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className={TD_CLS}>
                          {(historyPage - 1) * LIMIT + index + 1}
                        </TableCell>
                        <TableCell className={TD_CLS}>
                          {item.permission_label || item.permission_key || "-"}
                        </TableCell>
                        <TableCell className={TD_CLS}>
                          <AccessActionBadge action={item.action} />
                        </TableCell>
                        <TableCell className={TD_CLS}>
                          {item.performed_by?.name || "Superadmin"}
                        </TableCell>
                        <TableCell className={TD_CLS}>
                          {formatDateTime(item.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {historyTotalPages > 1 && (
                <TablePagination
                  currentPage={historyPage}
                  totalPages={historyTotalPages}
                  setCurrentPage={setHistoryPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
