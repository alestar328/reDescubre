import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bbklmczvhlflnozcpdgj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Avatares de Google (login OAuth)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
