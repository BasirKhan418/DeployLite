"use client"
import type { Metadata } from "next";
import NextTopLoader from 'nextjs-toploader';
import localFont from "next/font/local";
import "./globals.css";
import { usePathname } from "next/navigation";
import { ThemeProvider } from 'next-themes';
import Sidebar from "@/utils/Sidebar/Sidebar";
import StoreProvider from "./StoreProvider";
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
  return (
    <html lang="en">
      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
<NextTopLoader
  color="#2299DD"
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
{(pathname !== '/login' && pathname !== '/signup' &&pathname!='/autherror'&&pathname!='/authsuccess'&&pathname!='/forgot'&&pathname!='/reset'&&pathname!='/verifyemail'&&pathname!='/otp'&&pathname!='/githubauth'&&pathname!='/githuberr') ? <Sidebar>
  
  {children}</Sidebar> : children}
</ThemeProvider>
</StoreProvider>
      </body>
      
    </html>
  );
}
