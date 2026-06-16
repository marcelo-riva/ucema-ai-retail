/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true
  },
  output: "export",
  reactStrictMode: true,
  trailingSlash: true
};

export default nextConfig;
