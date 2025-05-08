/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flagcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'restfulcountries.com',
        pathname: '/assets/images/flags/**',
      }
    ],
  },
};

module.exports = nextConfig;
