import { apiConnector, handleResponse } from "./core";
import { permissionsEndpoints } from "./apis";

const {
  CATALOG_API,
  REQUESTS_API,
  MY_REQUESTS_API,
  MY_HISTORY_API,
  ADMIN_REQUESTS_API,
  ADMIN_USERS_API,
  GRANT_ACCESS_API,
  REVOKE_ACCESS_API,
} = permissionsEndpoints;

/**
 * Drawer permission APIs — self-service requests plus the superadmin's
 * grant/revoke and request review endpoints.
 */
const permissions = {
  /* ----------------------------- Admin (self) ----------------------------- */

  GetCatalog: async () => {
    let response = null;
    try {
      response = await apiConnector("GET", CATALOG_API);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * @param {{ permission_key: string, reason?: string }} data
   */
  RequestAccess: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", REQUESTS_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetMyRequests: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", MY_REQUESTS_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetMyHistory: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", MY_HISTORY_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  WithdrawRequest: async (id) => {
    let response = null;
    try {
      response = await apiConnector(
        "PATCH",
        `${REQUESTS_API}/${id}/withdraw`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /* --------------------------- Superadmin only ---------------------------- */

  GetAllRequests: async (page = 1, limit = 10) => {
    let response = null;
    try {
      response = await apiConnector("GET", ADMIN_REQUESTS_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  ApproveRequest: async (id) => {
    let response = null;
    try {
      response = await apiConnector(
        "PATCH",
        `${ADMIN_REQUESTS_API}/${id}/approve`
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  DenyRequest: async (id, data = {}) => {
    let response = null;
    try {
      response = await apiConnector(
        "PATCH",
        `${ADMIN_REQUESTS_API}/${id}/deny`,
        data
      );
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  GetUsersWithPermissions: async (page = 1, limit = 50) => {
    let response = null;
    try {
      response = await apiConnector("GET", ADMIN_USERS_API, null, null, {
        page,
        limit,
      });
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * @param {{ user_id: string, permission_key: string }} data
   */
  GrantAccess: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", GRANT_ACCESS_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * @param {{ user_id: string, permission_key: string }} data
   */
  RevokeAccess: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", REVOKE_ACCESS_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default permissions;
