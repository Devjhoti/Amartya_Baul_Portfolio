/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every image is committed to /public — no remote image host in the render
  // path. PRD §8.4
  //
  // Verification/production-check builds set NEXT_DIST_DIR=.next-build so they
  // never clobber the .next directory a running `next dev` depends on —
  // sharing it crashes the dev server (stale manifests, ENOENT _document).
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
