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
