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
 * Edit an existing admin. Mirrors the Create User form field-for-field — a
 * superadmin can change anything — with one difference: password is optional
 * here, and only sent when actually filled in.
 *
 * Superadmin-only, both by the drawer (superadminOnly in the sidebar menu) and
 * by the backend (`isSuperadmin` guards every /v1/admin/users route).
 */
export const EditUser = ({
  open,
  setOpen,
  user,
  roles = [],
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState(EMPTY);

  // Seed the form from the selected user each time the modal opens.
  useEffect(() => {
    if (open && user) {
      queueMicrotask(() =>
        setForm({
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          password: "",
          role_key: user.primary_role || "",
        })
      );
    }
  }, [open, user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // last_name is optional; password is optional on edit (blank = unchanged).
  const isValid =
    form.first_name.trim() &&
    form.email.trim() &&
    form.phone_number.trim() &&
    form.role_key &&
    !loading;

  // Nothing to save until something actually differs.
  const isDirty =
    user &&
    (form.first_name.trim() !== (user.first_name || "") ||
      form.last_name.trim() !== (user.last_name || "") ||
      form.email.trim() !== (user.email || "") ||
      form.phone_number.trim() !== (user.phone_number || "") ||
      form.role_key !== (user.primary_role || "") ||
      form.password.trim().length > 0);

  const roleOptions = roles.filter((r) => r.role_key !== "SUPERADMIN");

  const handleSubmit = () => {
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone_number: form.phone_number.trim(),
      role_key: form.role_key,
    };
    // Only send a password when one was typed, so a blank field never wipes it.
    if (form.password.trim()) payload.password = form.password.trim();
    onSubmit?.(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-[#323232] border-b border-gray-200 pb-2">
            Edit User
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
              Password
            </label>
            <Input
              type="text"
              value={form.password}
              onChange={set("password")}
              placeholder="Leave blank to keep current password"
              className="h-10"
            />
          </div>

          <div>
            <label className="text-[#4B4B4B] font-normal text-sm block mb-1">
              Role <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <Select
              value={form.role_key}
              onValueChange={(val) => setForm((f) => ({ ...f, role_key: val }))}
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
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              disabled={!isValid || !isDirty}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
