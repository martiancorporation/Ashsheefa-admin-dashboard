import { create } from "zustand";
import API from "@/api";
import { playEmergencyAlert } from "@/lib/emergencyAlertSound";

// Show the "lots of SOS" popup once the count reaches this many. Bump as needed.
export const SOS_ALERT_THRESHOLD = 1;

// Shared Emergency-SOS state so the sidebar badge and the dashboard popup
// stay in sync from a single API call.
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
      // Every time we hit the SOS API and there are pending alerts, sound the
      // audible emergency notification.
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

  // Reset alert state for a fresh dashboard session. Called when the dashboard
  // mounts (i.e. on each login) so that after logout → login the popup shows
  // again — the store is an in-memory singleton and otherwise keeps the old
  // `dismissed` flag across a client-side re-login (no full page reload).
  resetAlert: () => set({ dismissed: false, hasFetched: false, total: 0 }),
}));

export default useSosStore;
