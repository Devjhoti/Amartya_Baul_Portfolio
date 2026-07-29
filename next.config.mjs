/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every image is committed to /public — no remote image host in the render
  // path. PRD §8.4
  //
  // Verification/production-check builds set NEXT_DIST_DIR=.next-build so they
  // never clobber the .next directory a running `next dev` depends on —
  // sharing it crashes the dev server (stale manifests, ENOENT _document).
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // The hero portrait renders at quality 92; Next 16 requires every non-75
  // quality to be declared.
  images: {
    qualities: [75, 92],
  },

  // pkgit.net answers with X-Frame-Options SAMEORIGIN, so it refuses to be
  // embedded from anywhere else — proving it: a bare iframe of it renders
  // Chrome's blocked-content placeholder. Serving it back through this origin
  // satisfies that header, since the response then IS same-origin.
  //
  // It is a Vite SPA whose shell references /assets/* from the root, so that
  // path is carried across too. Nothing in this project uses /assets — public/
  // holds fonts, logos, og, posters and tech — so there is no collision, but
  // any future asset of ours must not live there.
  async rewrites() {
    return [
      { source: "/pkgit-live", destination: "https://pkgit.net/" },
      { source: "/pkgit-live/:path*", destination: "https://pkgit.net/:path*" },
      { source: "/assets/:path*", destination: "https://pkgit.net/assets/:path*" },
    ];
  },
};

export default nextConfig;
