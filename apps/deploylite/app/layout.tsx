import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import localFont from "next/font/local";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import ClientLayout from "@/components/ClientLayout";
import ThemeWrapper from "@/components/ThemeWrapper";


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

export const metadata: Metadata = {
  title: "DeployLite",
  description: "Your deployment platform",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '120x120' },
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <ThemeWrapper>
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
            <ClientLayout>{children}</ClientLayout>
          </ThemeWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
