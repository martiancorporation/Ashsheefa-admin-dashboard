import { useEffect, useState } from "react";
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
import { Plus, Trash2, RotateCcw, Pencil } from "lucide-react";
import { toast } from "sonner";
import API from "@/api";
import {
  unwrap,
  formatDateTime,
  fullName,
  UserStatusBadge,
  LoadingRowsCell,
  TABLE_CLS,
  THEAD_CLS,
  TH_CLS,
  TD_CLS,
} from "../rbac/helpers";
import { CreateUser } from "./_components/create-user";
import { DeleteUser } from "./_components/delete-user";
import { EditUser } from "./_components/edit-user";

const COLUMNS = ["Name", "Email", "Phone", "Role", "Status", "Actions"];
const DELETED_COLUMNS = ["Name", "Email", "Role", "Last Status", "Restore"];
const HISTORY_COLUMNS = ["No.", "User", "Action", "Change", "By", "Date & Time"];

const ACTION_LABELS = {
  created: "Created",
  profile_updated: "Details updated",
  role_changed: "Role changed",
  status_changed: "Status changed",
  deleted: "Deleted",
  restored: "Restored",
};

const LIMIT = 10;

/**
 * Render the "Change" cell of a history row.
 *
 * Role/status entries store uppercase keys (ACTIVE, SUPERADMIN) and read better
 * normalised. A profile edit stores real names and phone numbers, so it is
 * shown exactly as recorded.
 */
const renderChange = (item) => {
  const verbatim = item.action === "profile_updated";
  const cls = verbatim ? "" : "capitalize";
  const fmt = (v) => (verbatim ? v : v.toLowerCase());

  if (item.from && item.to) {
    return (
      <span className={cls}>
        {fmt(item.from)} → {fmt(item.to)}
      </span>
    );
  }

  if (item.from || item.to) {
    return <span className={cls}>{fmt(item.from || item.to)}</span>;
  }

  return "—";
};

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editing, setEditing] = useState(false);

  const [deletedUsers, setDeletedUsers] = useState([]);
  const [deletedPage, setDeletedPage] = useState(1);
  const [deletedTotalPages, setDeletedTotalPages] = useState(1);
  const [deletedLoading, setDeletedLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchUsers = async (p = page) => {
    try {
      setLoading(true);
      const res = await API.adminUsers.ListUsers(p, LIMIT);
      if (res) {
        setUsers(res.users || []);
        setTotalPages(res.pagination?.total_pages || 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    const res = await API.roles.ListRoles();
    if (res) setRoles(res.roles || []);
  };

  const fetchDeleted = async (p = deletedPage) => {
    try {
      setDeletedLoading(true);
      const res = await API.adminUsers.GetDeletedUsers(p, LIMIT);
      if (res) {
        setDeletedUsers(res.users || []);
        setDeletedTotalPages(res.pagination?.total_pages || 1);
      }
    } finally {
      setDeletedLoading(false);
    }
  };

  const fetchHistory = async (p = historyPage) => {
    try {
      setHistoryLoading(true);
      const res = await API.adminUsers.GetHistory(p, LIMIT);
      if (res) {
        setHistory(res.history || []);
        setHistoryTotalPages(res.pagination?.total_pages || 1);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    fetchDeleted(deletedPage);
  }, [deletedPage]);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [historyPage]);

  // Refresh everything a mutation can touch.
  const refreshAll = () => {
    fetchUsers(page);
    fetchDeleted(deletedPage);
    fetchHistory(1);
    setHistoryPage(1);
  };

  const isSuperadminRow = (user) => user.primary_role === "SUPERADMIN";

  const roleOptions = roles.filter((r) => r.role_key !== "SUPERADMIN");

  const handleCreate = async (form) => {
    try {
      setSaving(true);
      const res = unwrap(await API.adminUsers.CreateUser(form));
      if (res?.user) {
        toast.success("User created");
        setCreateOpen(false);
        refreshAll();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleChangeRole = async (user, role_key) => {
    const res = unwrap(await API.adminUsers.UpdateUser(user.id, { role_key }));
    if (res?.user) {
      toast.success("Role updated");
      refreshAll();
    }
  };

  const handleToggleStatus = async (user) => {
    const next = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const res = unwrap(await API.adminUsers.UpdateUser(user.id, { status: next }));
    if (res?.user) {
      toast.success(next === "ACTIVE" ? "User activated" : "User deactivated");
      refreshAll();
    }
  };

  const openEdit = (user) => {
    setEditTarget(user);
    setEditOpen(true);
  };

  const handleEdit = async (form) => {
    if (!editTarget) return;
    try {
      setEditing(true);
      const res = unwrap(await API.adminUsers.UpdateUser(editTarget.id, form));
      if (res?.user) {
        toast.success("User details updated");
        setEditOpen(false);
        refreshAll();
      }
    } finally {
      setEditing(false);
    }
  };

  const openDelete = (user) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const handleDelete = async (user) => {
    try {
      setDeleting(true);
      const res = unwrap(await API.adminUsers.DeleteUser(user.id));
      if (res?.deleted) {
        toast.success("User deleted");
        setDeleteOpen(false);
        refreshAll();
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async (user) => {
    try {
      setRestoringId(user.id);
      const res = unwrap(await API.adminUsers.RestoreUser(user.id));
      if (res?.user) {
        toast.success("User restored");
        refreshAll();
      }
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-[1.5px] h-[15px] bg-[#7F7F7F]"></div>
          <p className="text-[#4B4B4B] font-medium">Users</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 h-9 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create User</span>
        </Button>
      </div>

      <p className="text-xs text-[#7F7F7F] -mt-1">
        Create admin accounts and assign their role.
      </p>

      <div className="w-full h-[calc(100%-60px)] overflow-y-auto eme-scroll space-y-6">
        {/* Active users */}
        {loading ? (
          <LoadingRowsCell label="Loading users…" />
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
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={COLUMNS.length}
                      className="text-center py-10 text-gray-500 text-sm"
                    >
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell
                        className={`${TD_CLS} font-medium text-[#323232]`}
                      >
                        {fullName(user)}
                      </TableCell>
                      <TableCell className={`${TD_CLS} truncate`}>
                        {user.email}
                      </TableCell>
                      <TableCell className={TD_CLS}>
                        {user.phone_number}
                      </TableCell>
                      <TableCell className={TD_CLS}>
                        {isSuperadminRow(user) ? (
                          <span className="capitalize">
                            {user.primary_role?.toLowerCase()}
                          </span>
                        ) : (
                          <Select
                            value={user.primary_role || ""}
                            onValueChange={(val) => handleChangeRole(user, val)}
                          >
                            <SelectTrigger className="w-full h-9">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map((r) => (
                                <SelectItem key={r.role_key} value={r.role_key}>
                                  {r.role_label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className={TD_CLS}>
                        <UserStatusBadge status={user.status} />
                      </TableCell>
                      <TableCell className={`${TD_CLS} text-center`}>
                        {isSuperadminRow(user) ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              title="Edit details"
                              onClick={() => openEdit(user)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(user)}
                              // Resting: dark label on a tinted fill.
                              // Hover:   tinted label on a white fill.
                              // Both states are stated outright so they beat
                              // the outline variant's own bg-background /
                              // hover:bg-accent / hover:text-accent-foreground.
                              className={`cursor-pointer ${
                                user.status === "ACTIVE"
                                  ? "border-yellow-300 bg-yellow-50 text-[#323232] hover:bg-white hover:text-yellow-700"
                                  : "border-green-300 bg-green-50 text-[#323232] hover:bg-white hover:text-green-700"
                              }`}
                            >
                              {user.status === "ACTIVE"
                                ? "Deactivate"
                                : "Activate"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                              title="Delete user"
                              onClick={() => openDelete(user)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
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

        {/* Deleted users — restorable */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              Deleted Users
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              Deleted accounts. Restoring brings a user back with their previous
              role and status.
            </p>
          </div>

          {deletedLoading ? (
            <LoadingRowsCell label="Loading deleted users…" />
          ) : (
            <>
              <Table className={TABLE_CLS}>
                <TableHeader className={THEAD_CLS}>
                  <TableRow>
                    {DELETED_COLUMNS.map((col) => (
                      <TableHead
                        key={col}
                        className={`${TH_CLS} ${
                          col === "Restore" ? "text-center" : ""
                        }`}
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deletedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={DELETED_COLUMNS.length}
                        className="text-center py-10 text-gray-500 text-sm"
                      >
                        No deleted users.
                      </TableCell>
                    </TableRow>
                  ) : (
                    deletedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell
                          className={`${TD_CLS} font-medium text-[#323232]`}
                        >
                          {fullName(user)}
                        </TableCell>
                        <TableCell className={`${TD_CLS} truncate`}>
                          {user.email}
                        </TableCell>
                        <TableCell className={`${TD_CLS} capitalize`}>
                          {user.primary_role?.toLowerCase() || "-"}
                        </TableCell>
                        <TableCell className={TD_CLS}>
                          <UserStatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className={`${TD_CLS} text-center`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            title="Restore"
                            disabled={restoringId === user.id}
                            onClick={() => handleRestore(user)}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {deletedTotalPages > 1 && (
                <TablePagination
                  currentPage={deletedPage}
                  totalPages={deletedTotalPages}
                  setCurrentPage={setDeletedPage}
                />
              )}
            </>
          )}
        </div>

        {/* User history */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              User History
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              A record of user creation, role changes and activation changes.
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
                        No user history yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className={`${TD_CLS} align-top`}>
                          {(historyPage - 1) * LIMIT + index + 1}
                        </TableCell>
                        <TableCell className={`${TD_CLS} align-top`}>
                          <div className="font-medium text-[#323232]">
                            {item.target_name || "—"}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {item.target_email}
                          </div>
                        </TableCell>
                        <TableCell className={`${TD_CLS} align-top`}>
                          {ACTION_LABELS[item.action] || item.action}
                        </TableCell>
                        <TableCell className={`${TD_CLS} align-top`}>
                          {renderChange(item)}
                        </TableCell>
                        <TableCell className={`${TD_CLS} align-top`}>
                          {item.performed_by?.name || "—"}
                        </TableCell>
                        <TableCell className={`${TD_CLS} align-top`}>
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

      <CreateUser
        open={createOpen}
        setOpen={setCreateOpen}
        roles={roles}
        onSubmit={handleCreate}
        loading={saving}
      />
      <EditUser
        open={editOpen}
        setOpen={setEditOpen}
        user={editTarget}
        roles={roles}
        onSubmit={handleEdit}
        loading={editing}
      />
      <DeleteUser
        open={deleteOpen}
        setOpen={setDeleteOpen}
        user={deleteTarget}
        onDelete={handleDelete}
        loading={deleting}
      />
    </>
  );
}
