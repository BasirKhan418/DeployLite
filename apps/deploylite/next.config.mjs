/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 🔴 ADD THIS LINE
  serverExternalPackages: ["pdfkit"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
