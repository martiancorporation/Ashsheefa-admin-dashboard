import { dashboardEndpoints } from "./apis";
import { apiConnector, handleResponse } from "./core";

const { GET_ALL_DASHBOARD_DATA_API } = dashboardEndpoints;

const dashboard = {
  getDashboardData: async () => {
    let response = null;
    try {
      response = await apiConnector("GET", GET_ALL_DASHBOARD_DATA_API);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default dashboard;
