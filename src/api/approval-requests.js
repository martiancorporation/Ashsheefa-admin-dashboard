import { apiConnector, handleResponse } from "./core";
import { approvalRequestsEndpoints } from "./apis";

const {
  REQUESTS_API,
  PENDING_API,
  RECORD_API,
  ADMIN_API,
  ADMIN_COUNTS_API,
  ADMIN_BULK_API,
} = approvalRequestsEndpoints;

const call = async (method, url, data, params, options) => {
  let response = null;
  try {
    response = await apiConnector(method, url, data, null, params);
  } catch (error) {
    response = error;
  }
  return handleResponse(response, options);
};

/**
 * Approval requests — a non-superadmin proposes a payment-status change, the
 * superadmin approves or rejects it. `entity_type` is one of
 * "appointment" | "checkup_booking" | "test_booking".
 */
const approvalRequests = {
  /* ------------------------------ Requester ------------------------------ */

  /**
   * @param {{ entity_type: string, entity_id: string, changes: object, reason?: string }} data
   */
  CreateRequest: (data) => call("POST", REQUESTS_API, data),

  /** Pending requests for these records, keyed by record id. */
  GetPendingForRecords: (entityType, ids = []) =>
    call("GET", PENDING_API, null, { entity_type: entityType, ids: ids.join(",") }, {
      silentStatuses: [403],
    }),

  /** Every request raised on one record, newest first. */
  GetRecordRequests: (entityType, entityId) =>
    call("GET", `${RECORD_API}/${entityType}/${entityId}`),

  WithdrawRequest: (id) => call("PATCH", `${REQUESTS_API}/${id}/withdraw`),

  /* ----------------------------- Superadmin ------------------------------ */

  /**
   * @param {{ status?: string, entity_type?: string, search?: string, page?: number, limit?: number }} params
   */
  GetAllRequests: (params) => call("GET", ADMIN_API, null, params),

  GetCounts: () => call("GET", ADMIN_COUNTS_API, null, null, { silentStatuses: [403] }),

  ApproveRequest: (id, data = {}) => call("PATCH", `${ADMIN_API}/${id}/approve`, data),

  RejectRequest: (id, data = {}) => call("PATCH", `${ADMIN_API}/${id}/reject`, data),

  /**
   * @param {{ ids: string[], action: "approve"|"reject", review_reason?: string }} data
   */
  BulkReview: (data) => call("POST", ADMIN_BULK_API, data),
};

export default approvalRequests;
