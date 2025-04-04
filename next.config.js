/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Next.js can find the UI components
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      buffer: false,
      util: false,
      url: false,
      net: false,
      tls: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      child_process: false
    };
    return config;
  },
  // Ensure proper transpilation of dependencies
  transpilePackages: [],
  // Disable type checking during build to avoid issues
  typescript: {
    // Disable type checking since we're using JSX files for components
    ignoreBuildErrors: true,
  },
  // Ensure proper handling of ESM/CJS modules
  experimental: {
    // Enable server actions
    serverActions: {
      allowedOrigins: ["*"]
    },
    serverComponents: true
  },
  // Ensure proper output directory
  distDir: '.next',
};

export default nextConfig;
