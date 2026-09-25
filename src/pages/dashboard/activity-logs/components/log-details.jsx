import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ActionBadge,
  LogStatusBadge,
  formatLogDate,
  formatLogTime,
  formatRoleKey,
  fieldLabel,
  formatChangeValue,
  humanise,
} from "../helpers";

/**
 * Everything recorded about one entry.
 *
 * The table can only show what fits; the parts that matter when someone is
 * actually investigating — the field-level diff, the endpoint, the IP, the
 * refusal reason — live here.
 */

const Row = ({ label, children }) => (
  <div className="grid grid-cols-[130px_1fr] gap-3 py-1.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-[#7F7F7F]">{label}</span>
    <span className="text-xs text-[#323232] break-words">{children || "—"}</span>
  </div>
);

export const LogDetails = ({ open, setOpen, log }) => {
  if (!log) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl bg-white max-h-[85vh] overflow-y-auto eme-scroll">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#323232]">
            {log.title || "Activity detail"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 pb-2">
          <ActionBadge action={log.action} />
          <LogStatusBadge status={log.status} />
          <span className="text-xs text-[#7F7F7F]">
            {formatLogDate(log.created_at)} · {formatLogTime(log.created_at)}
          </span>
        </div>

        <div className="space-y-0">
          <Row label="Module">
            {log.module}
            {log.sub_module ? ` › ${log.sub_module}` : ""}
          </Row>
          <Row label="Description">{log.description}</Row>

          {log.changes?.length > 0 && (
            <Row label="Changed">
              <div className="space-y-1">
                {log.changes.map((change, index) => {
                  const marksPaid = log.changes.some(
                    (c) => c.field === "paymentStatus" && String(c.to).toLowerCase() === "paid"
                  );
                  const newOnly =
                    change.from === change.to ||
                    (marksPaid && ["paymentMode", "transaction_id"].includes(change.field));
                  return (
                    <div key={`${change.field}-${index}`}>
                      <span className="font-medium">{fieldLabel(change.field)}</span>
                      {": "}
                      {!newOnly && (
                        <>
                          <span className="text-red-700">{formatChangeValue(change.field, change.from)}</span>
                          {" → "}
                        </>
                      )}
                      <span className="text-green-700">{formatChangeValue(change.field, change.to)}</span>
                    </div>
                  );
                })}
              </div>
            </Row>
          )}

          <Row label="Record">
            {log.entity_label || log.entity_id
              ? `${log.entity_label || "—"}${log.entity_id ? ` (${log.entity_id})` : ""}`
              : ""}
          </Row>
          <Row label="Record type">{log.entity_type && humanise(log.entity_type)}</Row>

          <Row label="Performed by">
            {log.actor_name}
            {log.actor_email ? ` · ${log.actor_email}` : ""}
            {log.actor_role ? ` · ${formatRoleKey(log.actor_role)}` : ""}
          </Row>
          <Row label="Actor type">{humanise(log.actor_type)}</Row>

          {log.status === "failed" && <Row label="Reason">{log.reason}</Row>}

          <Row label="Endpoint">
            {log.method ? `${log.method} ${log.path}` : log.path}
          </Row>
          <Row label="Response">{log.status_code}</Row>
          <Row label="IP address">{log.ip}</Row>
        </div>
      </DialogContent>
    </Dialog>
  );
};
