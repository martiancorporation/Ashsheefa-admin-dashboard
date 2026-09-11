import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, TriangleAlert, Loader2 } from "lucide-react";
import { fullName } from "../../rbac/helpers";

/**
 * Delete User confirmation modal. The delete is a soft delete — the account is
 * restorable from the Deleted Users table.
 */
export const DeleteUser = ({
  open,
  setOpen,
  user,
  onDelete,
  loading = false,
}) => {
  const name = fullName(user);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#323232]">
            Delete User
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
            <TriangleAlert className="w-7 h-7 text-red-500" />
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-[#323232]">
              Are you sure you want to delete this user?
            </p>
            {(name || user?.email) && (
              <p className="text-sm text-[#7F7F7F] truncate max-w-full px-4">
                <span className="font-semibold">{name || user?.email}</span>{" "}
                will lose access. You can restore them later.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="w-28 cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-28 border border-red-300 hover:bg-red-50 text-red-600 cursor-pointer"
            onClick={() => onDelete?.(user)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
