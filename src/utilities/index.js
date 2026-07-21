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

/**
 * Returns a stable UUID that uniquely identifies this browser installation.
 * Generated once and persisted in localStorage so it survives page reloads
 * and is shared across tabs of the same browser (same device = same ID).
 *
 * Replaces the old getEncodedUserAgent() which returned window.navigator.userAgent —
 * a string that is identical across every tab and window of the same browser,
 * causing all sessions to collapse onto the same token document in the backend.
 */
export const getOrCreateDeviceId = () => {
  if (typeof window === "undefined") return "server-side";
  const key = "ashsheefa_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    // crypto.randomUUID() is supported in all modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+)
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const getPaginationPages = (currentPage, totalPages, maxVisible = 3) => {
  const pages = [];

  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  pages.push(1);

  if (currentPage > Math.ceil(maxVisible / 2) + 1) {
    pages.push("...");
  }

  const start = Math.max(2, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages - 1, currentPage + Math.floor(maxVisible / 2));

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - Math.floor(maxVisible / 2) - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
};