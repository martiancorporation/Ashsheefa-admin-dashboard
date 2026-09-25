import { useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import API from "@/api";
import { unwrap } from "@/pages/dashboard/rbac/helpers";
import { ChangeLine, FIELD_LABEL } from "./approval-helpers";

/**
 * Ask the superadmin to approve a change instead of making it. Nothing on the
 * record changes until the request is approved.
 *
 * @param {object} props
 * @param {string} props.entityType - "appointment" | "checkup_booking" | "test_booking"
 * @param {object} props.record - the row (needs _id and the current field values)
 * @param {object} props.changes - field → proposed value, e.g. { paymentStatus: "failed" }
 * @param {string} [props.recordLabel] - shown under the title
 * @param {Function} [props.onSent] - called after the request is created
 */
export function RequestChangeModal({ open, onOpenChange, entityType, record, changes, recordLabel, onSent }) {
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) setReason("");
  }, [open]);

  const lines = Object.entries(changes || {}).map(([field, to]) => ({
    field,
    field_label: FIELD_LABEL[field],
    from: record?.[field] ?? "",
    to,
  }));

  const handleSend = async () => {
    setSending(true);
    try {
      const res = unwrap(
        await API.approvalRequests.CreateRequest({
          entity_type: entityType,
          entity_id: record._id,
          changes,
          reason: reason.trim(),
        })
      );
      if (res?.request) {
        toast.success("Request sent", {
          description: "The superadmin will review it. Use “Check Request Status” to follow it.",
        });
        onSent?.(res.request);
        onOpenChange(false);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !sending && onOpenChange(v)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-[#4B4B4B]">
            <Send className="w-4 h-4 text-blue-600" />
            Request Approval
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {recordLabel ? `${recordLabel} — ` : ""}payment status changes need superadmin approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1.5">
            {lines.map((change) => (
              <ChangeLine key={change.field} change={change} />
            ))}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[#4A4A4B] text-sm">
              Reason <span className="text-gray-400 font-normal">(optional)</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why should this change be made?"
              className="bg-[#FBFBFB] border-[#DDDDDD] shadow-none text-sm"
              maxLength={500}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSend}
            disabled={sending || !record?._id}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending…
              </>
            ) : (
              "Send Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
