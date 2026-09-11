import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TablePagination from "@/pages/components/common/Pagination";
import { Trash2, Pencil, Plus, RotateCcw, Eye } from "lucide-react";
import { toast } from "sonner";
import API from "@/api";
import {
  unwrap,
  RoleActionBadge,
  formatDateTime,
  LoadingRowsCell,
  TABLE_CLS,
  THEAD_CLS,
  TH_CLS,
  TD_CLS,
} from "../rbac/helpers";
import { CreateRole } from "./_components/create-role";
import { RoleAccess } from "./_components/role-access";
import { DeleteRole } from "./_components/delete-role";

const COLUMNS = ["Role", "Drawers", "Users", "Actions"];
const HISTORY_COLUMNS = [
  "No.",
  "Role",
  "Action",
  "Drawers (at the time)",
  "By",
  "Date & Time",
  "Restore",
];

const HISTORY_LIMIT = 10;

export default function RoleManagementPage() {
  const [roles, setRoles] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);

  const [accessOpen, setAccessOpen] = useState(false);
  const [accessRole, setAccessRole] = useState(null);
  const [accessKeys, setAccessKeys] = useState([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await API.roles.ListRoles();
      if (res) setRoles(res.roles || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchCatalog = async () => {
    const res = await API.permissions.GetCatalog();
    if (res) setCatalog(res.permissions || []);
  };

  const fetchHistory = async (page) => {
    try {
      setHistoryLoading(true);
      const res = await API.roles.GetHistory(page, HISTORY_LIMIT);
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
    fetchCatalog();
  }, []);

  useEffect(() => {
    fetchHistory(historyPage);
  }, [historyPage]);

  // Settings is always available to every admin, so it isn't assignable.
  const assignableCatalog = catalog.filter(
    (c) => c.permission_key !== "settings"
  );

  const isSuperadminRole = (role) => role.role_key === "SUPERADMIN";

  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      const created = unwrap(await API.roles.CreateRole(payload));
      if (created?.role) {
        toast.success("Role created");
        setCreateOpen(false);
        fetchRoles();
        fetchHistory(1);
        setHistoryPage(1);
      }
    } finally {
      setSaving(false);
    }
  };

  const openAccess = async (role) => {
    setAccessRole(role);

    // Superadmin implicitly has every drawer — show them all, read-only.
    if (isSuperadminRole(role)) {
      setAccessKeys(assignableCatalog.map((c) => c.permission_key));
      setAccessOpen(true);
      return;
    }

    // Fetch current drawers BEFORE opening so the modal initialises checked.
    const res = await API.roles.GetRolePermissions(role.id);
    setAccessKeys(
      (res?.permission_keys || []).filter((k) => k !== "settings")
    );
    setAccessOpen(true);
  };

  const handleSaveAccess = async (keys) => {
    if (!accessRole) return;
    try {
      setSaving(true);
      const res = unwrap(await API.roles.SetRolePermissions(accessRole.id, keys));
      if (res?.role) {
        toast.success("Drawer access updated");
        setAccessOpen(false);
        fetchRoles();
      }
    } finally {
      setSaving(false);
    }
  };

  const openDelete = (role) => {
    setDeleteTarget(role);
    setDeleteOpen(true);
  };

  const handleDelete = async (role) => {
    try {
      setSaving(true);
      const res = unwrap(await API.roles.DeleteRole(role.id));
      if (res?.deleted) {
        toast.success("Role deleted");
        setDeleteOpen(false);
        fetchRoles();
        fetchHistory(1);
        setHistoryPage(1);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (id) => {
    try {
      setRestoringId(id);
      const res = unwrap(await API.roles.RestoreRole(id));
      if (res?.role) {
        toast.success("Role restored");
        fetchRoles();
        fetchHistory(historyPage);
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
          <p className="text-[#4B4B4B] font-medium">Roles</p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 h-9 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Role</span>
        </Button>
      </div>

      <p className="text-xs text-[#7F7F7F] -mt-1">
        Create roles and choose which drawers each role can access.
      </p>

      <div className="w-full h-[calc(100%-60px)] overflow-y-auto eme-scroll space-y-6">
        {/* Roles */}
        {loading ? (
          <LoadingRowsCell label="Loading roles…" />
        ) : (
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
              {roles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="text-center py-10 text-gray-500 text-sm"
                  >
                    No roles yet.
                  </TableCell>
                </TableRow>
              ) : (
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className={`${TD_CLS} font-medium text-[#323232]`}>
                      {role.role_label}
                    </TableCell>
                    <TableCell className={TD_CLS}>
                      {isSuperadminRole(role)
                        ? "All"
                        : role.permission_count ?? 0}
                    </TableCell>
                    <TableCell className={TD_CLS}>
                      {role.user_count ?? 0}
                    </TableCell>
                    <TableCell className={`${TD_CLS} text-center`}>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer"
                          onClick={() => openAccess(role)}
                        >
                          {isSuperadminRole(role) ? (
                            <>
                              <Eye className="w-3.5 h-3.5" /> View
                            </>
                          ) : (
                            <>
                              <Pencil className="w-3.5 h-3.5" /> Access
                            </>
                          )}
                        </Button>
                        {!isSuperadminRole(role) && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            title="Delete role"
                            onClick={() => openDelete(role)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Role history — created/deleted events with restore */}
        <div className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold text-[#4B4B4B]">
              Role History
            </h2>
            <p className="text-xs text-[#7F7F7F]">
              Every role created or deleted, with the drawers it had. Deleted
              roles can be restored.
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
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={HISTORY_COLUMNS.length}
                        className="text-center py-10 text-gray-500 text-sm"
                      >
                        No role history yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((item, index) => {
                      const roleExists = roles.some(
                        (r) => r.role_key === item.role_key
                      );
                      return (
                        <TableRow key={item.id}>
                          <TableCell className={`${TD_CLS} align-top`}>
                            {(historyPage - 1) * HISTORY_LIMIT + index + 1}
                          </TableCell>
                          <TableCell
                            className={`${TD_CLS} align-top font-medium text-[#323232]`}
                          >
                            {item.role_label}
                          </TableCell>
                          <TableCell className={`${TD_CLS} align-top`}>
                            <RoleActionBadge action={item.action} />
                          </TableCell>
                          <TableCell className={`${TD_CLS} align-top`}>
                            {(item.permission_keys || []).length === 0 ? (
                              <span className="text-xs text-gray-400">
                                None
                              </span>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {item.permission_keys.map((key) => (
                                  <span
                                    key={key}
                                    className="inline-flex items-center rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs text-[#4B4B4B] capitalize"
                                  >
                                    {key}
                                  </span>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className={`${TD_CLS} align-top`}>
                            {item.performed_by?.name || "—"}
                          </TableCell>
                          <TableCell className={`${TD_CLS} align-top`}>
                            {formatDateTime(item.created_at)}
                          </TableCell>
                          <TableCell
                            className={`${TD_CLS} align-top text-center`}
                          >
                            {item.action === "deleted" && !roleExists ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                title="Restore"
                                disabled={restoringId === item.id}
                                onClick={() => handleRestore(item.id)}
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </Button>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
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

      <CreateRole
        open={createOpen}
        setOpen={setCreateOpen}
        catalog={assignableCatalog}
        onSubmit={handleCreate}
        loading={saving}
      />
      <RoleAccess
        open={accessOpen}
        setOpen={setAccessOpen}
        role={accessRole}
        catalog={assignableCatalog}
        initialKeys={accessKeys}
        onSave={handleSaveAccess}
        loading={saving}
        readOnly={accessRole ? accessRole.role_key === "SUPERADMIN" : false}
      />
      <DeleteRole
        open={deleteOpen}
        setOpen={setDeleteOpen}
        role={deleteTarget}
        onDelete={handleDelete}
        loading={saving}
      />
    </>
  );
}
