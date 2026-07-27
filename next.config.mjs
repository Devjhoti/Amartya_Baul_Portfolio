/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudinary is allowed during development only — every asset is downloaded
    // and committed to /public before launch. PRD §8.4
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

export default nextConfig;
