// components/ClientLayout.tsx (Client Component)
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/utils/Sidebar/Sidebar";
import Chatbot from '@/components/Chatbot';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getCookieObject = () => {
    return document.cookie
      .split("; ")
      .reduce((acc: Record<string, string>, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
      }, {});
  };

  // Check login or not
  const checkAuth = async () => {
    try {
      const fetchResult = await fetch("/api/get/home");
      const result = await fetchResult.json();
      
      if (!result.success) {
        const publicRoutes = [
          "/login",
          "/signup",
          "/autherror",
          "/authsuccess",
          "/forgot",
          "/reset",
          "/verifyemail",
          "/otp",
          "/githubauth",
          "/githuberr"
        ];

        if (!publicRoutes.includes(pathname)) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // Handle auth check failure - maybe redirect to login on error
      const publicRoutes = [
        "/login",
        "/signup",
        "/autherror",
        "/authsuccess",
        "/forgot",
        "/reset",
        "/verifyemail",
        "/otp",
        "/githubauth",
        "/githuberr"
      ];

      if (!publicRoutes.includes(pathname)) {
        router.push("/login");
      }
    }
  };

  useEffect(() => {
    console.log("Checking authentication...");
    checkAuth();
  }, [pathname]); // Add pathname dependency to recheck when route changes

  // Define public routes that don't need sidebar
  const publicRoutes = [
    "/login",
    "/signup",
    "/autherror",
    "/authsuccess",
    "/forgot",
    "/reset",
    "/verifyemail",
    "/otp",
    "/githubauth",
    "/githuberr"
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar>{children}</Sidebar>
      <Chatbot />
    </>
  );
}