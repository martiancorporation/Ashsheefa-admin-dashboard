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
import { Button } from "@/components/ui/button";
import TablePagination from "@/pages/components/common/Pagination";
import { X } from "lucide-react";
import { toast } from "sonner";
import API from "@/api";
import {
  unwrap,
  StatusBadge,
  formatDateTime,
  fullName,
  LoadingRowsCell,
  TABLE_CLS,
  THEAD_CLS,
  TH_CLS,
  TD_CLS,
} from "../rbac/helpers";

const REQUEST_COLUMNS = [
  "No.",
  "Requested By",
  "Access",
  "Date & Time",
  "Status",
  "Actions",
];
const USER_COLUMNS = ["User", "Role", "Granted Drawers"];

const LIMIT = 10;

/**
 * Superadmin's Permissions drawer: review access requests, and grant/revoke a
 * drawer for any admin directly.
 *
 * Reached only when SHOW_PERMISSIONS_DRAWER is true in src/pages/components/common/Sidebar.jsx.
 */
export default function PermissionRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [reqPage, setReqPage] = useState(1);
  const [reqTotalPages, setReqTotalPages] = useState(1);
  const [reqLoading, setReqLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [catalog, setCatalog] = useState([]);

  const [grantUser, setGrantUser] = useState("");
  const [grantDrawer, setGrantDrawer] = useState("");
  const [granting, setGranting] = useState(false);

  const keyToLabel = useMemo(() => {
    const map = {};
    catalog.forEach((c) => {
      map[c.permission_key] = c.permission_label;
    });
    return map;
  }, [catalog]);

  // Grant dropdown excludes Settings (always available) and drawers the
  // selected user already holds.
  const grantDrawerOptions = useMemo(() => {
    const selected = users.find((u) => u.id === grantUser);
    const granted = new Set(selected?.permissions || []);
    return catalog.filter(
      (c) => c.permission_key !== "settings" && !granted.has(c.permission_key)
    );
  }, [catalog, users, grantUser]);

  const fetchRequests = async (p = reqPage) => {
    try {
      setReqLoading(true);
      const res = await API.permissions.GetAllRequests(p, LIMIT);
      if (res) {
        setRequests(res.requests || []);
        setReqTotalPages(res.pagination?.total_pages || 1);
      }
    } finally {
      setReqLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await API.permissions.GetUsersWithPermissions(1, 50);
      if (res) setUsers(res.users || []);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchCatalog = async () => {
    const res = await API.permissions.GetCatalog();
    if (res) setCatalog(res.permissions || []);
  };

  useEffect(() => {
    fetchUsers();
    fetchCatalog();
  }, []);

  useEffect(() => {
    fetchRequests(reqPage);
  }, [reqPage]);

  const handleApprove = async (id) => {
    const res = unwrap(await API.permissions.ApproveRequest(id));
    if (res?.request) {
      toast.success("Request approved");
      fetchRequests(reqPage);
      fetchUsers();
    }
  };

  const handleDeny = async (id) => {
    const res = unwrap(await API.permissions.DenyRequest(id, {}));
    if (res?.request) {
      toast.success("Request denied");
      fetchRequests(reqPage);
    }
  };

  const handleGrant = async () => {
    if (!grantUser || !grantDrawer) return;
    try {
      setGranting(true);
      const res = unwrap(
        await API.permissions.GrantAccess({
          user_id: grantUser,
          permission_key: grantDrawer,
        })
      );
      if (res?.user_id) {
        toast.success("Access granted");
        setGrantDrawer("");
        fetchUsers();
      }
    } finally {
      setGranting(false);
    }
  };

  const handleRevoke = async (userId, permissionKey) => {
    const res = unwrap(
      await API.permissions.RevokeAccess({
        user_id: userId,
        permission_key: permissionKey,
      })
    );
    if (res?.user_id) {
      toast.success("Access revoked");
      fetchUsers();
    }
  };

  return (
    <>
      <div className="w-full flex items-center space-x-2">
        <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
        <p className="text-[#4B4B4B] font-medium">Permissions</p>
      </div>

      <div className="w-full h-[calc(100%-30px)] overflow-y-auto eme-scroll space-y-6">
        {/* Requests */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              Access Requests
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              Approve or deny drawer access requested by admins.
            </p>
          </div>

          {reqLoading ? (
            <LoadingRowsCell label="Loading requests…" />
          ) : (
            <>
              <Table className={TABLE_CLS}>
                <TableHeader className={THEAD_CLS}>
                  <TableRow>
                    {REQUEST_COLUMNS.map((col) => (
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
                        colSpan={REQUEST_COLUMNS.length}
                        className="text-center py-10 text-gray-500 text-sm"
                      >
                        No access requests.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className={TD_CLS}>
                          {(reqPage - 1) * LIMIT + index + 1}
                        </TableCell>
                        <TableCell className={TD_CLS}>
                          <div className="font-medium text-[#323232]">
                            {item.requested_by?.name || "-"}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {item.requested_by?.email || ""}
                          </div>
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
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(item.id)}
                                className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() => handleDeny(item.id)}
                              >
                                Deny
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {reqTotalPages > 1 && (
                <TablePagination
                  currentPage={reqPage}
                  totalPages={reqTotalPages}
                  setCurrentPage={setReqPage}
                />
              )}
            </>
          )}
        </div>

        {/* Manage user access */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              Manage User Access
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              Directly grant or revoke a drawer for any admin.
            </p>
          </div>

          {/* Grant form */}
          <div className="flex flex-col md:flex-row gap-3 md:items-end border border-gray-300 rounded-md p-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#7F7F7F] mb-1">
                User
              </label>
              <Select
                value={grantUser}
                onValueChange={(val) => {
                  setGrantUser(val);
                  setGrantDrawer(""); // reset drawer when the user changes
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a user…" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {`${fullName(u)} (${u.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#7F7F7F] mb-1">
                Drawer
              </label>
              <Select
                value={grantDrawer}
                onValueChange={setGrantDrawer}
                disabled={!grantUser}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      grantUser ? "Select a drawer…" : "Select a user first…"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {grantDrawerOptions.map((c) => (
                    <SelectItem key={c.permission_key} value={c.permission_key}>
                      {c.permission_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGrant}
              disabled={!grantUser || !grantDrawer || granting}
              className="h-9 px-6 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              {granting ? "Granting…" : "Grant"}
            </Button>
          </div>

          {/* Users table */}
          {usersLoading ? (
            <LoadingRowsCell label="Loading admins…" />
          ) : (
            <Table className={TABLE_CLS}>
              <TableHeader className={THEAD_CLS}>
                <TableRow>
                  {USER_COLUMNS.map((col) => (
                    <TableHead key={col} className={TH_CLS}>
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={USER_COLUMNS.length}
                      className="text-center py-10 text-gray-500 text-sm"
                    >
                      No admins found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className={`${TD_CLS} align-top`}>
                        <div className="font-medium text-[#323232]">
                          {fullName(u)}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {u.email}
                        </div>
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top capitalize`}>
                        {u.primary_role?.toLowerCase() || "-"}
                      </TableCell>
                      <TableCell className={`${TD_CLS} align-top`}>
                        {(u.permissions || []).length === 0 ? (
                          <span className="text-xs text-gray-400">
                            No drawers granted
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {u.permissions.map((key) => (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-2.5 py-0.5 text-xs text-[#4B4B4B]"
                              >
                                {keyToLabel[key] || key}
                                <button
                                  type="button"
                                  onClick={() => handleRevoke(u.id, key)}
                                  className="text-gray-400 hover:text-red-500 cursor-pointer"
                                  title="Revoke access"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
}
