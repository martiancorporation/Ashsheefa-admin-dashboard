import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Drawer Access modal for a role. Read-only for SUPERADMIN, which implicitly
 * holds every drawer.
 *
 * `directGrants` maps a drawer key to the names of this role's users who were
 * granted it directly under Permissions. Such a drawer (when the role itself
 * doesn't hold it) shows checked but locked: the role can't grant or take it
 * away — it is revoked per user under Permissions. It is never saved to the role.
 */
export const RoleAccess = ({
  open,
  setOpen,
  role,
  catalog = [],
  initialKeys = [],
  directGrants = {},
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
            {catalog.map((c) => {
              const key = c.permission_key;
              const grantedTo = directGrants[key] || [];
              // Held by the role itself → editable as usual.
              const locked = !readOnly && grantedTo.length > 0 && !keys.includes(key);
              const disabled = readOnly || locked;

              const row = (
                <label
                  key={key}
                  className={`flex items-center gap-2 text-sm ${
                    disabled
                      ? "cursor-not-allowed text-gray-400"
                      : "cursor-pointer text-[#4B4B4B]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={locked || keys.includes(key)}
                    onChange={() => !disabled && toggleKey(key)}
                    disabled={locked}
                    aria-disabled={disabled || undefined}
                    className={`accent-blue-600 ${
                      disabled ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  />
                  {c.permission_label}
                </label>
              );

              if (!locked) return row;

              return (
                <Tooltip key={key}>
                  <TooltipTrigger asChild>{row}</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {`Granted directly to ${grantedTo.join(", ")} — revoke it under Permissions`}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {!readOnly &&
            catalog.some(
              (c) => directGrants[c.permission_key]?.length && !keys.includes(c.permission_key)
            ) && (
              <p className="text-xs text-gray-400">
                Greyed-out ticks are granted directly to a user under Permissions,
                not by this role. Hover one to see who.
              </p>
            )}

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
