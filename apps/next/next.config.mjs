import { withHighlightConfig } from "@highlight-run/next/server";
import { withAxiom } from "next-axiom";
import nextBuildId from "next-build-id";
import { dirname } from "path";
import { fileURLToPath } from "url";

// @ts-check

/*
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
import "@quenti/env/client/client.mjs";
import "@quenti/env/server/server.mjs";

import pjson from "./package.json" assert { type: "json" };

const shouldAnalyzeBundles = process.env.ANALYZE === "true";

const withBundleAnalyzer = shouldAnalyzeBundles
  ? (await import("@next/bundle-analyzer")).default
  : () => undefined;

const appVersion = pjson.version;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const domains = ["lh3.googleusercontent.com"];
if (process.env.USERS_BUCKET_URL)
  domains.push(new URL(process.env.USERS_BUCKET_URL).host);
if (process.env.ASSETS_BUCKET_URL)
  domains.push(new URL(process.env.ASSETS_BUCKET_URL).host);

/** @type {import("next").NextConfig} */
let config = {
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  experimental: {
    instrumentationHook: true,
    esmExternals: false,
  },
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains,
  },
  transpilePackages: [
    "@quenti/auth",
    "@quenti/core",
    "@quenti/emails",
    "@quenti/env",
    "@quenti/interfaces",
    "@quenti/lib",
    "@quenti/components",
    "@quenti/branding",
    "@quenti/payments",
    "@quenti/prisma",
    "@quenti/trpc",
    "@quenti/inngest",
    "@quenti/integrations",
    "@quenti/types",
    "@quenti/website",
  ],
  rewrites: async () => [
    {
      source: "/:id(_[a-zA-Z0-9]{10})",
      destination: "/share-resolver/:id",
    },
    {
      source: "/:profile(@[a-zA-Z0-9-_]+)",
      destination: "/profile/:profile",
    },
    {
      source: "/:profile(@[a-zA-Z0-9-_]+)/folders/:slug",
      destination: "/profile/:profile/folders/:slug",
    },
    {
      source: "/:profile(@[a-zA-Z0-9-_]+)/folders/:slug/flashcards",
      destination: "/profile/:profile/folders/:slug/flashcards",
    },
    {
      source: "/:profile(@[a-zA-Z0-9-_]+)/folders/:slug/match",
      destination: "/profile/:profile/folders/:slug/match",
    },
    {
      source: "/:id(c[a-z0-9]{24})",
      destination: "/sets/:id",
    },
    {
      source: "/:id(c[a-z0-9]{24})/edit",
      destination: "/sets/:id/edit",
    },
    {
      source: "/:id(c[a-z0-9]{24})/flashcards",
      destination: "/sets/:id/flashcards",
    },
    {
      source: "/:id(c[a-z0-9]{24})/learn",
      destination: "/sets/:id/learn",
    },
    {
      source: "/:id(c[a-z0-9]{24})/match",
      destination: "/sets/:id/match",
    },
    {
      source: "/:id(c[a-z0-9]{24})/test",
      destination: "/sets/:id/test",
    },
  ],
  productionBrowserSourceMaps: true,
};

if (shouldAnalyzeBundles) {
  config = withBundleAnalyzer(config);
} else {
  config = withHighlightConfig(withAxiom(config), {
    appVersion,
    configureHighlightProxy: true,
    uploadSourceMaps: false,
  });
}

export default config;
