import axios from "axios";
import moment from "moment";
import { toast } from "sonner";
import { authEndpoints } from "./apis";
const { REFRESH_TOKEN } = authEndpoints;

export const axiosInstance = axios.create({});
export const apiConnector = (method, url, bodyData, headers, params) => {
  // For FormData, ensure we don't set Content-Type header
  let finalHeaders = headers;
  if (bodyData instanceof FormData) {
    finalHeaders = { ...headers };
    // Remove Content-Type if it exists to let browser set it automatically
    if (finalHeaders && finalHeaders["Content-Type"]) {
      delete finalHeaders["Content-Type"];
    }

    // Add additional headers for better compatibility
    finalHeaders["Accept"] = "application/json";
  }

  // Add authentication headers for all routes (dashboard only)
  const session = localStorage.getItem("authentications")
    ? JSON.parse(localStorage.getItem("authentications"))
    : null;

  if (session?.access_token) {
    finalHeaders = {
      ...finalHeaders,
      Authorization: `Bearer ${session.access_token}||${
        session.active_session_refresh_token || ""
      }`,
    };

    // Only set Content-Type for non-FormData requests
    if (!(bodyData instanceof FormData)) {
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  console.log("API Connector - Method:", method);
  console.log("API Connector - URL:", url);
  console.log("API Connector - Headers:", finalHeaders);
  console.log(
    "API Connector - Data type:",
    bodyData ? bodyData.constructor.name : "null"
  );

  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: finalHeaders ? finalHeaders : null,
    params: params ? params : null,
  });
};

export const handleResponse = (response) => {
  console.log("HandleResponse - Full response:", response);

  // Handle fetch responses (for news add)
  if (response?.ok !== undefined) {
    if (response?.status === 200 && response?.ok) {
      return response?.data;
    } else if (response?.status === 202) {
      toast.warning("Something went wrong", {
        description: response.data?.error || "Request accepted but processing",
      });
    } else if (response?.status === 401) {
      toast.error("Session expired", {
        description: "Please logout and log in again.",
      });
    } else if (response?.status === 500) {
      toast.error("Server error", {
        description: response?.data?.message || "Internal server error",
      });
    } else {
      console.error("Fetch response error:", response);
      toast.error("Request failed", {
        description: response?.data?.message || "Please try again",
      });
    }
    return false;
  }

  // Handle axios responses (for other APIs)
  // Check if it's a successful response (status 200-299)
  if (response?.status >= 200 && response?.status < 300) {
    return response?.data;
  }

  // Handle axios error responses (when axios throws an error)
  if (response?.response) {
    const status = response.response.status;
    const data = response.response.data;

    if (status === 401) {
      toast.error("Session expired", {
        description: "Please logout and log in again.",
      });
    } else if (status === 400) {
      toast.error("Bad request", {
        description: data?.message || "Invalid request data",
      });
    } else if (status === 404) {
      toast.error("Not found", {
        description: data?.message || "Resource not found",
      });
    } else if (status === 500) {
      toast.error("Server error", {
        description: data?.message || "Internal server error",
      });
    } else if (status === 202) {
      toast.warning("Something went wrong", {
        description: data?.message || "Request accepted but processing",
      });
    } else {
      toast.error("Request failed", {
        description: data?.message || "An error occurred",
      });
    }
  } else {
    // Handle other types of errors
    console.error("Unexpected response:", response);
    toast.error("Unexpected error", {
      description: response?.message || "Please contact server admin.",
    });
  }

  return false;
};

// export const getToken = async () => {
//   const session = localStorage.getItem("authentications")
//     ? JSON.parse(localStorage.getItem("authentications"))
//     : null;
//   console.log(session);
//
//
//   let response = session?.access_token;
//   const token_expired =
//     moment(session?.token_expiry).diff(moment(), "seconds") < 5 ? true : false;
//
//   if (session && token_expired) {
//     //call refresh token and update client token
//     // console.log("token refresh");
//     try {
//       const apiresponse = await apiConnector(
//         "GET",
//         REFRESH_TOKEN +
//           session.email +
//           "/" +
//           session.active_session_refresh_token +
//           "/" +
//           session.device
//       );
//       if (apiresponse?.status === 200) {
//         session.access_token = apiresponse.data.access_token;
//         session.token_expiry = apiresponse.data.token_expiry;
//         session.active_session_refresh_token =
//           apiresponse.data.active_session_refresh_token;
//         response = session.access_token;
//         localStorage.setItem("userSession", JSON.stringify(session));
//       } else {
//         throw apiresponse.data.error;
//       }
//     } catch (e) {
//       Config.UNAUTHORIZED_EXCEPTION = true;
//       toast.error("Unauthorized api call", {
//         description: "You are not authorized for the action.",
//       });
//     }
//   }
//
//   return response + "||" + session?.device;
// };
