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

  Logout: async (router, clearAuthData) => {
    clearAuthData();
    router.push("/");
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
