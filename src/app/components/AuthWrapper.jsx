"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import useAuthDataStore from "@/store/authStore";

export default function AuthWrapper({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const authData = useAuthDataStore((state) => state.authData);

    useEffect(() => {
        // Check if the current path is a dashboard route
        if (pathname.startsWith('/dashboard')) {
            // Check if user is not authenticated
            if (!authData || !authData.access_token) {
                // Show toast message
                toast.error("Please login to access this page");

                // Redirect to login page
                router.push('/');
            }
        }
    }, [pathname, authData, router]);

    // If user is authenticated and on login page, redirect to dashboard
    useEffect(() => {
        if (pathname === '/' && authData && authData.access_token) {
            router.push('/dashboard');
        }
    }, [pathname, authData, router]);

    // If user is not authenticated and trying to access dashboard, show loading or redirect
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

    // If user is authenticated and on login page, show loading while redirecting
    if (pathname === '/' && authData && authData.access_token) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return children;
} 