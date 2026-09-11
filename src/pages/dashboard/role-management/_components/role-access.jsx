import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Drawer Access modal for a role. Read-only for SUPERADMIN, which implicitly
 * holds every drawer.
 */
export const RoleAccess = ({
  open,
  setOpen,
  role,
  catalog = [],
  initialKeys = [],
  onSave,
  loading = false,
  readOnly = false,
}) => {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    if (open) queueMicrotask(() => setKeys(initialKeys || []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, role?.id]);

  const toggleKey = (key) =>
    setKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-[#323232] border-b border-gray-200 pb-2">
            {role ? `${role.role_label} — Drawer Access` : "Drawer Access"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {catalog.map((c) => (
              <label
                key={c.permission_key}
                className={`flex items-center gap-2 text-sm ${
                  readOnly
                    ? "cursor-not-allowed text-gray-400"
                    : "cursor-pointer text-[#4B4B4B]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={keys.includes(c.permission_key)}
                  onChange={() => !readOnly && toggleKey(c.permission_key)}
                  aria-disabled={readOnly || undefined}
                  className={`accent-blue-600 ${
                    readOnly ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
                {c.permission_label}
              </label>
            ))}
          </div>

          {readOnly && (
            <p className="text-xs text-gray-400">
              A superadmin always has access to every drawer — this cannot be
              changed.
            </p>
          )}

          {readOnly ? (
            <div className="pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full h-11 cursor-pointer"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full h-11 cursor-pointer"
                disabled={loading}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => onSave?.(keys)}
                className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  "Save Access"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
