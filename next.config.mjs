import { withContentCollections } from "@content-collections/next";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  turbopack: {
    root: __dirname,
  },
};

// withContentCollections must be the outermost plugin
export default withContentCollections(nextConfig);
