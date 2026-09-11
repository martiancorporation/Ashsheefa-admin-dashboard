import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const EMPTY = { role: "", permission_keys: [] };

/**
 * Create Role modal. A role is just a plain name, taken exactly as typed, plus
 * the drawers it can open.
 */
export const CreateRole = ({
  open,
  setOpen,
  catalog = [],
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) queueMicrotask(() => setForm(EMPTY));
  }, [open]);

  const toggleKey = (key) =>
    setForm((f) => ({
      ...f,
      permission_keys: f.permission_keys.includes(key)
        ? f.permission_keys.filter((k) => k !== key)
        : [...f.permission_keys, key],
    }));

  const canSubmit = Boolean(form.role.trim()) && !loading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-[#323232] border-b border-gray-200 pb-2">
            Create Role
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
              Role <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <Input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Front Desk"
              className="h-10"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#7F7F7F] uppercase tracking-wider block mb-2">
              Drawers this role can access
            </label>
            <div className="grid grid-cols-2 gap-2">
              {catalog.map((c) => (
                <label
                  key={c.permission_key}
                  className="flex items-center gap-2 text-sm text-[#4B4B4B] cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={form.permission_keys.includes(c.permission_key)}
                    onChange={() => toggleKey(c.permission_key)}
                    className="accent-blue-600"
                  />
                  {c.permission_label}
                </label>
              ))}
            </div>
          </div>

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
              onClick={() =>
                onSubmit?.({
                  role: form.role.trim(),
                  permission_keys: form.permission_keys,
                })
              }
              className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              disabled={!canSubmit}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
