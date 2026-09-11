import { apiConnector, handleResponse } from "./core";
import { authEndpoints } from "./apis";
import { deleteCookie } from "@/utilities";
import { toast } from "sonner";

const {
  SIGNUP_API,
  LOGIN_API,
  REFRESH_TOKEN,
  RESEND_OTP_API,
  FORGET_PASSWORD_API,
  UPDATE_PASSWORD,
  UPDATE_ADMIN_DETAILS_API,
  CHANGE_EMAIL_INITIATE,
  VERIFY_EMAIL,
  ME_API,
} = authEndpoints;
const auth = {
  Login: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", LOGIN_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  /**
   * Fetch the logged-in admin plus their freshly resolved RBAC access
   * (roles / permissions / is_superadmin). Used by the route guard to pick up
   * a grant or revoke without forcing a re-login.
   */
  Me: async () => {
    let response = null;
    try {
      response = await apiConnector("GET", ME_API);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  SignUp: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", SIGNUP_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  ResendOTP: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", RESEND_OTP_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  ForgetPassword: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", FORGET_PASSWORD_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  RefreshToken: async (email, token, device) => {
    let response = null;
    try {
      const url = `${REFRESH_TOKEN}${email}/${token}/${device}`;
      response = await apiConnector("GET", url);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  Logout: async (navigate, clearAuthData) => {
    clearAuthData();
    navigate("/");
    toast.success("Logged Out");
  },

  UpdatePassword: async (data) => {
    let response = null;
    try {
      response = await apiConnector("PUT", UPDATE_PASSWORD, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  ChangeEmailInitiate: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", CHANGE_EMAIL_INITIATE, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  verifyEmail: async (data) => {
    let response = null;
    try {
      response = await apiConnector("POST", VERIFY_EMAIL, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },

  UpdateAdminDetails: async (data) => {
    let response = null;
    try {
      response = await apiConnector("PUT", UPDATE_ADMIN_DETAILS_API, data);
    } catch (error) {
      response = error;
    }
    return handleResponse(response);
  },
};

export default auth;
