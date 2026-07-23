import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/commons/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    const co = "/co";
    return [
      { source: "/casos", destination: `${co}/casos`, permanent: true },
      { source: "/casos/:id", destination: `${co}/casos/:id`, permanent: true },
      { source: "/contexto", destination: `${co}/contexto`, permanent: true },
      { source: "/fuentes", destination: `${co}/fuentes`, permanent: true },
      { source: "/gaps", destination: `${co}/gaps`, permanent: true },
      { source: "/escenarios", destination: `${co}/escenarios`, permanent: true },
      { source: "/poder", destination: `${co}/poder`, permanent: true },
      { source: "/partidos", destination: `${co}/partidos`, permanent: true },
      { source: "/actores", destination: `${co}/actores`, permanent: true },
    ];
  },
};

export default nextConfig;
