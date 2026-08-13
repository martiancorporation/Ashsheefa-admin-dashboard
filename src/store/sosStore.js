import { create } from "zustand";
import API from "@/api";
import { playEmergencyAlert } from "@/lib/emergencyAlertSound";

// Show the popup once the pending SOS count reaches this many.
export const SOS_ALERT_THRESHOLD = 1;

// Shared Emergency-SOS state: the sidebar badge and the dashboard popup stay in
// sync from a single API call. `total` = pending (non-resolved) SOS count.
const useSosStore = create((set) => ({
  total: 0,
  loading: false,
  hasFetched: false,
  dismissed: false, // true once the admin closes the popup this session

  fetchSosCount: async () => {
    set({ loading: true });
    try {
      // limit: 1 — we only need the `total` field, not the records.
      const res = await API.emergencySos.getAllEmergencySos({
        page: 1,
        limit: 1,
      });
      const total = typeof res?.total === "number" ? res.total : 0;
      set({ total, loading: false, hasFetched: true });
      if (total >= SOS_ALERT_THRESHOLD) {
        playEmergencyAlert();
      }
      return total;
    } catch (e) {
      set({ loading: false, hasFetched: true });
      return 0;
    }
  },

  setDismissed: (v) => set({ dismissed: v }),

  // Reset transient popup state on fresh login (keeps nothing persisted).
  resetAlert: () => set({ dismissed: false, hasFetched: false, total: 0 }),
}));

export default useSosStore;

/* ─────────────────────────────────────────────────────────────────────────────
 * NEW SOS FLOW (messaging-style unread) — COMMENTED OUT FOR NOW.
 * Re-enable later: swap the store above for the one below, and re-enable the
 * matching commented blocks in:
 *   - src/app/components/common/Sidebar.jsx        (unread badge)
 *   - src/app/components/common/EmergencySosAlert.jsx (unread popup)
 *   - src/app/dashboard/emergency-sos/page.js      (resolved/unresolved chips + markAllSeen)
 *
 * import { create } from "zustand";
 * import API from "@/api";
 * import { playEmergencyAlert } from "@/lib/emergencyAlertSound";
 *
 * const LAST_SEEN_KEY = "sos_last_seen_at";
 * const getLastSeen = () => {
 *   if (typeof window === "undefined") return 0;
 *   const v = localStorage.getItem(LAST_SEEN_KEY);
 *   return v ? new Date(v).getTime() : 0; // 0 (epoch) → nothing seen yet
 * };
 * const setLastSeen = (ms) => {
 *   if (typeof window !== "undefined") {
 *     localStorage.setItem(LAST_SEEN_KEY, new Date(ms).toISOString());
 *   }
 * };
 *
 * const useSosStore = create((set, get) => ({
 *   unresolved: 0, // pending SOS count → SOS page header chip
 *   resolved: 0,   // resolved SOS count → SOS page header chip
 *   unread: 0,     // new-since-last-seen → sidebar badge + popup
 *   loading: false,
 *   hasFetched: false,
 *   dismissed: false,
 *   _prevUnread: 0,
 *
 *   fetchSosCount: async () => {
 *     set({ loading: true });
 *     try {
 *       const res = await API.emergencySos.getAllEmergencySos({ page: 1, limit: 1000 });
 *       const records = Array.isArray(res?.data) ? res.data : [];
 *       const lastSeen = getLastSeen();
 *       const unresolved =
 *         typeof res?.total === "number"
 *           ? res.total
 *           : records.filter((r) => r?.status !== "resolved").length;
 *       const resolved = records.filter((r) => r?.status === "resolved").length;
 *       const unread = records.filter((r) => {
 *         if (r?.status === "resolved") return false;
 *         const t = r?.createdAt ? new Date(r.createdAt).getTime() : 0;
 *         return t > lastSeen;
 *       }).length;
 *       const prev = get()._prevUnread;
 *       const patch = { unresolved, resolved, unread, loading: false, hasFetched: true, _prevUnread: unread };
 *       if (unread > prev) { patch.dismissed = false; playEmergencyAlert(); }
 *       set(patch);
 *       return unread;
 *     } catch (e) {
 *       set({ loading: false, hasFetched: true });
 *       return 0;
 *     }
 *   },
 *
 *   markAllSeen: () => {
 *     setLastSeen(Date.now());
 *     set({ unread: 0, _prevUnread: 0, dismissed: true });
 *   },
 *
 *   setDismissed: (v) => set({ dismissed: v }),
 *   resetAlert: () => set({ hasFetched: false, dismissed: false, _prevUnread: 0 }),
 * }));
 *
 * export default useSosStore;
 * ───────────────────────────────────────────────────────────────────────────── */
