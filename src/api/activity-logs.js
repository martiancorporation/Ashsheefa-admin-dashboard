import { apiConnector, handleResponse } from "./core";
import { activityLogsEndpoints } from "./apis";

const {
  ACTIVITY_LOGS_API,
  ACTIVITY_LOG_FILTERS_API,
  ACTIVITY_LOG_EXPORT_API,
} = activityLogsEndpoints;

/**
 * Activity trail APIs. Read-only by design — rows are written server-side by
 * the logging middleware and there is no endpoint that can edit or remove one.
 *
 * Every endpoint is gated on the "activity-logs" drawer, which superadmin
 * bypasses like any other.
 */

/** Drop empty filters so the query string stays readable in the network tab. */
const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const activityLogs = {
  /**
   * One page of the trail.
   *
   * @param {object} params - page, limit, from, to (YYYY-MM-DD), search,
   *   module, sub_module, action, actor, actor_name, actor_type, status
   */
  List: async (params = {}) => {
    let response = null;
    try {
      response = await apiConnector(
        "GET",
        ACTIVITY_LOGS_API,
        null,
        null,
        clean(params)
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /** Distinct modules / sub-modules / actions / actors for the filter dropdowns. */
  Filters: async () => {
    let response = null;
    try {
      response = await apiConnector("GET", ACTIVITY_LOG_FILTERS_API);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * Every row matching the current filters (server-capped), for the .xlsx
   * export — not just the page on screen.
   */
  Export: async (params = {}) => {
    let response = null;
    try {
      response = await apiConnector(
        "GET",
        ACTIVITY_LOG_EXPORT_API,
        null,
        null,
        clean(params)
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default activityLogs;
