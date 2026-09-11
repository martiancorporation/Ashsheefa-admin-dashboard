import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const EMPTY = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  role_key: "",
};

/**
 * Create admin user modal. SUPERADMIN is never offered — that role is seeded,
 * not assigned from the UI.
 */
export const CreateUser = ({
  open,
  setOpen,
  roles = [],
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (open) queueMicrotask(() => setForm(EMPTY));
  }, [open]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // last_name is optional — everything else is required.
  const canSubmit =
    form.first_name.trim() &&
    form.email.trim() &&
    form.phone_number.trim() &&
    form.password.trim() &&
    form.role_key &&
    !loading;

  const roleOptions = roles.filter((r) => r.role_key !== "SUPERADMIN");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-[#323232] border-b border-gray-200 pb-2">
            Create User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
                First Name{" "}
                <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <Input
                value={form.first_name}
                onChange={set("first_name")}
                className="h-10"
              />
            </div>
            <div>
              <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
                Last Name
              </label>
              <Input
                value={form.last_name}
                onChange={set("last_name")}
                className="h-10"
              />
            </div>
          </div>

          <div>
            <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
              Email <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={set("email")}
              className="h-10"
            />
          </div>

          <div>
            <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
              Phone Number{" "}
              <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <Input
              value={form.phone_number}
              onChange={set("phone_number")}
              placeholder="10 digit number"
              className="h-10"
            />
          </div>

          <div>
            <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
              Password <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <Input
              type="text"
              value={form.password}
              onChange={set("password")}
              placeholder="At least 6 characters"
              className="h-10"
            />
          </div>

          <div>
            <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
              Role <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <Select
              value={form.role_key}
              onValueChange={(val) =>
                setForm((f) => ({ ...f, role_key: val }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role…" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r.role_key} value={r.role_key}>
                    {r.role_label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              onClick={() => onSubmit?.(form)}
              className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              disabled={!canSubmit}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
