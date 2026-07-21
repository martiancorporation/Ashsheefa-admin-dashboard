import { create } from "zustand";
import API from "@/api";

// Show the "lots of SOS" popup once the count reaches this many. Bump as needed.
export const SOS_ALERT_THRESHOLD = 1;

// Shared Emergency-SOS state so the sidebar badge and the dashboard popup
// stay in sync from a single API call.
const useSosStore = create((set) => ({
  total: 0,
  loading: false,
  hasFetched: false,
  alertShown: false, // popup shown once per dashboard session

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
      return total;
    } catch (e) {
      set({ loading: false, hasFetched: true });
      return 0;
    }
  },

  setAlertShown: (v) => set({ alertShown: v }),
}));

export default useSosStore;
