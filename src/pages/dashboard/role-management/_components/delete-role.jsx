import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, TriangleAlert, Loader2 } from "lucide-react";

/**
 * Delete Role confirmation modal.
 */
export const DeleteRole = ({
  open,
  setOpen,
  role,
  onDelete,
  loading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#323232]">
            Delete Role
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
            <TriangleAlert className="w-7 h-7 text-red-500" />
          </div>

          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-[#323232]">
              Are you sure you want to delete this role?
            </p>
            {role?.role_label && (
              <p className="text-sm text-[#7F7F7F] truncate max-w-full px-4">
                <span className="font-semibold">
                  &quot;{role.role_label}&quot;
                </span>{" "}
                will be removed.
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
            onClick={() => onDelete?.(role)}
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
