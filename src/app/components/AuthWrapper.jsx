"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import useAuthDataStore from "@/store/authStore";

export default function AuthWrapper({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const authData = useAuthDataStore((state) => state.authData);

    // Routing decisions (who can see "/" vs "/dashboard") are made server-side
    // in middleware.js, based on the auth cookie. This effect only handles the
    // client-side case where auth is cleared while already sitting on a
    // dashboard page (e.g. logout in another tab) without a full navigation.
    useEffect(() => {
        if (pathname.startsWith('/dashboard') && (!authData || !authData.access_token)) {
            setTimeout(() => {
                toast.warning("Please login to access this page", {
                    id: "please-login",
                });
            }, 1400);

            router.push('/');
        }
    }, [pathname, authData, router]);

    if (pathname.startsWith('/dashboard') && (!authData || !authData.access_token)) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return children;
} 