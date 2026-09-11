import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthDataStore from "@/store/authStore";
import { menuItems } from "./Sidebar";
import { canAccessRoute } from "@/lib/rbac";
import API from "@/api";

/**
 * RBAC route guard for the admin dashboard.
 *
 * Responsibilities:
 *  1. Keep the current admin's roles/permissions fresh (on mount + on tab
 *     focus), so a superadmin's grant/revoke reflects without a re-login.
 *  2. Block direct navigation to a drawer the admin cannot access.
 *
 * This is UX + defense-in-depth only. The backend is the real security
 * boundary — every gated route also runs `hasDrawerAccess` server-side.
 */
export default function RouteGuard({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const authData = useAuthDataStore((state) => state.authData);
  const setAuthData = useAuthDataStore((state) => state.setAuthData);

  const userId = authData?._id;

  // Refresh roles/permissions on mount and whenever the tab regains focus.
  useEffect(() => {
    if (!userId) return;

    const refreshAccess = async () => {
      const fresh = await API.auth.Me();
      if (!fresh?._id) return;

      // Merge, never replace: the stored session also holds the tokens that
      // `apiConnector` reads, and /auth/me does not return those.
      setAuthData({
        ...useAuthDataStore.getState().authData,
        first_name: fresh.first_name,
        last_name: fresh.last_name,
        email: fresh.email,
        phone_number: fresh.phone_number,
        account_type: fresh.account_type,
        status: fresh.status,
        roles: fresh.roles,
        primary_role: fresh.primary_role,
        is_superadmin: fresh.is_superadmin,
        permissions: fresh.permissions,
      });
    };

    refreshAccess();

    const onFocus = () => {
      if (document.visibilityState === "visible") refreshAccess();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
    // Re-run only when the logged-in identity changes, not on every permission
    // update — otherwise this loops.
  }, [userId, setAuthData]);

  const allowed = canAccessRoute(authData, pathname, menuItems);

  // Redirect away from a drawer the admin can't access.
  useEffect(() => {
    if (!allowed) navigate("/dashboard", { replace: true });
  }, [allowed, navigate]);

  // Avoid flashing protected content while redirecting.
  if (!allowed) return null;

  return children;
}
