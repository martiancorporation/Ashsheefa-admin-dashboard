export const ValidateMobile = (phone) => {
  let re = /^\d{10}$/;
  return re.test(phone);
};

export const setCookie = (name, value, days) => {
  if (typeof document !== "undefined") {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(
      JSON.stringify(value)
    )}; expires=${expires}; path=/`;
  }
};

export const getCookie = (name) => {
  if (typeof document !== "undefined") {
    const storedData = document.cookie.split("; ").reduce((r, v) => {
      const parts = v.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");

    if (storedData) {
      const data = JSON.parse(storedData);
      return data;
    }
  }
  return false;
};

export const deleteCookie = (name) => {
  if (typeof document !== "undefined") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

export const getEncodedUserAgent = () => {
  if (typeof window !== "undefined") {
    return encodeURIComponent(window.navigator.userAgent).replace(/%/g, "_");
  }
  return "Server-Side"; // Fallback value
};
