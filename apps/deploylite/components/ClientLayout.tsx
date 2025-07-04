"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/utils/Sidebar/Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

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
          "/githuberr",
          "/chatbotbuild"
        ];

        if (!publicRoutes.includes(pathname)) {
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error);
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
  }, [pathname]);

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
    </>
  );
}