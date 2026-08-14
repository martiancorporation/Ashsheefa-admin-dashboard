import { create } from "zustand";
import API from "@/api";
import { playEmergencyAlert } from "@/lib/emergencyAlertSound";

// ── NEW SOS FLOW (messaging-style "unread") — ACTIVE ──────────────────────────
//
// Three numbers drive the UI:
//   • unresolved → pending SOS count   → SOS page header chip
//   • resolved   → resolved SOS count  → SOS page header chip
//   • unread     → SOS that arrived AFTER the admin last opened the SOS page
//                  → sidebar badge + popup + alarm
//
// "Read" = opening the SOS page. That stamps `sos_last_seen_at` = now, so every
// current SOS becomes read and `unread` drops to 0 — badge and popup disappear.
// When a NEW SOS arrives later its createdAt is newer than the stamp, so unread
// fills again from 1, the badge returns and the popup re-arms. Resolving does
// NOT affect unread (it's purely time-based), so the count stays stable across
// resolve/undo.

// ── AUTO-REFRESH (SOS POLLING) ───────────────────────────────────────────────
// How often the dashboard re-checks for new SOS in the background, so an alert
// that arrives while the admin is idle is never missed (without it, counts only
// update on navigation/login). The alarm still only sounds when the unread
// count RISES, so a quiet poll makes no noise.
//
// ⚠️ If upper management / the client don't want background polling, delete this
// constant and the two "SOS POLLING" blocks in:
//   - src/app/components/common/Sidebar.jsx            (the poller)
//   - src/app/dashboard/emergency-sos/page.js          (table auto-reload)
export const SOS_POLL_INTERVAL_MS = 30000; // 30s

const LAST_SEEN_KEY = "sos_last_seen_at";

const getLastSeen = () => {
  if (typeof window === "undefined") return 0;
  const v = localStorage.getItem(LAST_SEEN_KEY);
  return v ? new Date(v).getTime() : 0; // 0 (epoch) → nothing seen yet
};

const setLastSeen = (ms) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_SEEN_KEY, new Date(ms).toISOString());
  }
};

const useSosStore = create((set, get) => ({
  unresolved: 0, // pending SOS count → SOS page header chip
  resolved: 0, // resolved SOS count → SOS page header chip
  unread: 0, // new-since-last-seen → sidebar badge + popup
  loading: false,
  hasFetched: false,
  dismissed: false, // popup dismissed this session
  _prevUnread: 0, // to detect a rise (new SOS) and re-arm popup + sound

  // Pass silent: true to refresh counts WITHOUT sounding the alarm (used by
  // resolve/undo, which are normal actions and must stay quiet).
  fetchSosCount: async (silent = false) => {
    set({ loading: true });
    try {
      const res = await API.emergencySos.getAllEmergencySos({
        page: 1,
        limit: 1000,
      });
      const records = Array.isArray(res?.data) ? res.data : [];
      const lastSeen = getLastSeen();

      // `total` from the API is the non-resolved count (accurate). Resolved is
      // counted from the fetched records.
      const unresolved =
        typeof res?.total === "number"
          ? res.total
          : records.filter((r) => r?.status !== "resolved").length;
      const resolved = records.filter((r) => r?.status === "resolved").length;

      const unread = records.filter((r) => {
        if (r?.status === "resolved") return false;
        const t = r?.createdAt ? new Date(r.createdAt).getTime() : 0;
        return t > lastSeen;
      }).length;

      const prev = get()._prevUnread;
      const patch = {
        unresolved,
        resolved,
        unread,
        loading: false,
        hasFetched: true,
        _prevUnread: unread,
      };
      // A new SOS arrived (unread rose) → re-open the popup and sound the alarm.
      if (!silent && unread > prev) {
        patch.dismissed = false;
        playEmergencyAlert();
      }
      set(patch);
      return unread;
    } catch (e) {
      set({ loading: false, hasFetched: true });
      return 0;
    }
  },

  // Called when the admin opens the SOS page: everything currently in is "read".
  markAllSeen: () => {
    setLastSeen(Date.now());
    set({ unread: 0, _prevUnread: 0, dismissed: true });
  },

  setDismissed: (v) => set({ dismissed: v }),

  // ── TEST-ONLY: rewinds the last-seen stamp so a just-created test SOS counts
  // as UNREAD, letting the badge/popup/alarm be exercised without the mobile
  // app. DISABLED — re-enable together with the "Trigger Test SOS" button.
  //
  // markUnseenForTest: (windowMs = 120000) => {
  //   setLastSeen(Date.now() - windowMs);
  //   set({ dismissed: false, _prevUnread: 0 });
  // },

  // Fresh dashboard session (runs on each login). Clears transient popup state
  // but KEEPS the persisted last-seen stamp, so already-read SOS stay read.
  resetAlert: () => set({ hasFetched: false, dismissed: false, _prevUnread: 0 }),
}));

export default useSosStore;

/* ─────────────────────────────────────────────────────────────────────────────
 * OLD FLOW — pending `total` only. COMMENTED OUT.
 *
 * This is the original SOS behaviour (badge/popup driven purely by the pending
 * count, no unread tracking). Kept for reference / rollback.
 *
 * To restore the OLD FLOW: swap the store above for the one below, and
 * re-enable the matching "OLD FLOW" blocks in:
 *   - src/app/components/common/Sidebar.jsx           (total badge)
 *   - src/app/components/common/EmergencySosAlert.jsx (total popup)
 *   - src/app/dashboard/emergency-sos/page.js         (remove chips + markAllSeen)
 *
 * export const SOS_ALERT_THRESHOLD = 1;
 *
 * const useSosStore = create((set) => ({
 *   total: 0,
 *   loading: false,
 *   hasFetched: false,
 *   dismissed: false,
 *
 *   fetchSosCount: async (silent = false) => {
 *     set({ loading: true });
 *     try {
 *       const res = await API.emergencySos.getAllEmergencySos({ page: 1, limit: 1 });
 *       const total = typeof res?.total === "number" ? res.total : 0;
 *       set({ total, loading: false, hasFetched: true });
 *       if (!silent && total >= SOS_ALERT_THRESHOLD) {
 *         playEmergencyAlert();
 *       }
 *       return total;
 *     } catch (e) {
 *       set({ loading: false, hasFetched: true });
 *       return 0;
 *     }
 *   },
 *
 *   setDismissed: (v) => set({ dismissed: v }),
 *   resetAlert: () => set({ dismissed: false, hasFetched: false, total: 0 }),
 * }));
 *
 * export default useSosStore;
 * ───────────────────────────────────────────────────────────────────────────── */
