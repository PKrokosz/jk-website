/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"]
  },
  experimental: {
    typedRoutes: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mp4$/i,
      type: "asset/resource",
      generator: {
        filename: "static/media/[name]-[hash][ext]"
      }
    });

    return config;
  }
};

export default nextConfig;
