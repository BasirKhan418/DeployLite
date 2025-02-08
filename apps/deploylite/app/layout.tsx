"use client";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import localFont from "next/font/local";
import "./globals.css";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";
import Sidebar from "@/utils/Sidebar/Sidebar";
import StoreProvider from "./StoreProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { get } from "http";
import Chatbot from '@/components/Chatbot';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
  //check login or not
  const checkAuth = async () => {
    const fetchResult = await fetch("/api/get/home");
    const result = await fetchResult.json();
    if (!result.success) {
      if (
        pathname !== "/login" &&
        pathname !== "/signup" &&
        pathname !== "/autherror" &&
        pathname !== "/authsuccess" &&
        pathname !== "/forgot" &&
        pathname !== "/reset" &&
        pathname !== "/verifyemail" &&
        pathname !== "/otp" &&
        pathname !== "/githubauth" &&
        pathname !== "/githuberr"
      ) {
        router.push("/login");
      }
    }
  };
  useEffect(() => {
    console.log("hello agar login nahi ho toh bhag jao...");
    checkAuth();
  }, []);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextTopLoader
              color="#D81B60"
              initialPosition={0.08}
              crawlSpeed={200}
              height={3}
              crawl={true}
              showSpinner={false}
              easing="ease"
              speed={200}
              shadow="0 0 10px #2299DD,0 0 5px #2299DD"
              zIndex={1600}
              showAtBottom={false}
            />
            {pathname !== "/login" &&
            pathname !== "/signup" &&
            pathname != "/autherror" &&
            pathname != "/authsuccess" &&
            pathname != "/forgot" &&
            pathname != "/reset" &&
            pathname != "/verifyemail" &&
            pathname != "/otp" &&
            pathname != "/githubauth" &&
            pathname != "/githuberr" ? (
              <>
                <Sidebar>{children}</Sidebar>
                <Chatbot/>
              </>
            ) : (
              children
            )}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
