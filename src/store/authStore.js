import { create } from "zustand";

// Helper function to set cookie
const setCookie = (name, value, days = 7) => {
  if (typeof window !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${JSON.stringify(
      value
    )};expires=${expires.toUTCString()};path=/`;
  }
};

// Helper function to remove cookie
const removeCookie = (name) => {
  if (typeof window !== "undefined") {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

const authStore = (set) => ({
  authData:
    typeof window !== "undefined" && localStorage.getItem("authentications")
      ? JSON.parse(localStorage.getItem("authentications"))
      : null,
  setAuthData: (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authentications", JSON.stringify(data));
      setCookie("authentications", data);
    }
    set(() => ({
      authData: data,
    }));
  },
  clearAuthData: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authentications");
      removeCookie("authentications");
    }
    set(() => ({
      authData: null,
    }));
  },
});

const useAuthDataStore = create(authStore);

export default useAuthDataStore;
