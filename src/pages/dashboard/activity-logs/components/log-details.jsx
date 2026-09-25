import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
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
  toDisplayLog,
} from "../helpers";

/**
 * Everything recorded about one entry.
 *
 * The table can only show what fits; the parts that matter when someone is
 * actually investigating — the field-level diff, the outcome, the refusal
 * reason, a link to the record — live here. Everything is worded for the
 * people using the dashboard, not for developers.
 */

const Row = ({ label, children }) => (
  <div className="grid grid-cols-[130px_1fr] gap-3 py-1.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-[#7F7F7F]">{label}</span>
    <span className="text-xs text-[#323232] break-words">{children || "—"}</span>
  </div>
);

/** Who acted, as the reader knows them. */
const USER_TYPE_LABELS = {
  admin: "Dashboard user",
  app_user: "Patient app user",
  public: "Website visitor (not signed in)",
  system: "Automatic (system)",
};

export const LogDetails = ({ open, setOpen, log: rawLog }) => {
  if (!rawLog) return null;
  // Rows from the table are already converted; converting twice is harmless.
  const log = rawLog.display_title !== undefined ? rawLog : toDisplayLog(rawLog);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl bg-white max-h-[85vh] overflow-y-auto eme-scroll">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-[#323232]">
            {log.display_title || "Activity detail"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2 pb-2">
          <ActionBadge action={log.display_action} />
          <LogStatusBadge status={log.status} />
          <span className="text-xs text-[#7F7F7F]">
            {formatLogDate(log.created_at)} · {formatLogTime(log.created_at)}
          </span>
        </div>

        <div className="space-y-0">
          <Row label="Module">
            {log.display_module}
            {log.display_sub_module ? ` › ${log.display_sub_module}` : ""}
          </Row>
          <Row label="What happened">{log.display_description}</Row>

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

          <Row label="Record">{log.entity_label}</Row>
          <Row label="Record type">{log.entity_type && humanise(log.entity_type)}</Row>

          <Row label="Performed by">
            {log.display_actor_name}
            {log.actor_email ? ` · ${log.actor_email}` : ""}
            {log.actor_role ? ` · ${formatRoleKey(log.actor_role)}` : ""}
          </Row>
          <Row label="User type">
            {USER_TYPE_LABELS[log.actor_type] || humanise(log.actor_type)}
          </Row>

          {log.status === "failed" && <Row label="Reason">{log.reason}</Row>}

          <Row label="Result">{log.display_result}</Row>

          {log.display_page && (
            <Row label="Where to find it">
              <Link
                to={log.display_page.to}
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                {log.display_page.label}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Row>
          )}

          <Row label="Network address (IP)">{log.display_network}</Row>
        </div>
      </DialogContent>
    </Dialog>
  );
};
