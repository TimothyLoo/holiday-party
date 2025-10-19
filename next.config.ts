import { NextConfig } from "next";

const isGitHubPages = process.env.DEPLOY_ENV === "GH_PAGES";
const repoName = "holiday-party";

const nextConfig: NextConfig = {
  // Export as static HTML
  output: "export",

  // Base path and asset prefix for GitHub Pages
  basePath: isGitHubPages ? `/${repoName}` : "",
  assetPrefix: isGitHubPages ? `/${repoName}/` : "",

  // React strict mode
  reactStrictMode: true,

  // Page extensions (if using .tsx for pages)
  pageExtensions: ["ts", "tsx", "js", "jsx"],

  // ESLint options
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Images (optional, if using next/image)
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
