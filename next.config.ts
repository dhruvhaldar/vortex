import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "X-XSS-Protection",
    // Sentinel: Set to 0 to disable the legacy XSS auditor, which can introduce vulnerabilities (CSP is the modern defense)
    value: "0",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Permissions-Policy",
    // Sentinel: Replace deprecated interest-cohort (FLoC) with browsing-topics to protect user privacy against the modern Google Topics API
    // Also explicitly disable powerful APIs like payment, usb, bluetooth, and display-capture to reduce the application's attack surface.
    // Sentinel: Added further restrictions for battery, screen-wake-lock, web-share, autoplay, fullscreen, picture-in-picture, and xr-spatial-tracking for enhanced defense-in-depth.
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=(), bluetooth=(), display-capture=(), accelerometer=(), gyroscope=(), magnetometer=(), midi=(), publickey-credentials-get=(), sync-xhr=(), battery=(), screen-wake-lock=(), web-share=(), autoplay=(), fullscreen=(), picture-in-picture=(), xr-spatial-tracking=()",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Sentinel: Add X-Permitted-Cross-Domain-Policies for defense-in-depth against Flash/Acrobat data extraction
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Content-Security-Policy",
    value: `default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ""}; connect-src 'self' raw.githack.com raw.githubusercontent.com data: blob:; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;`.replace(/\s+/g, ' ').trim(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Sentinel: Add Cross-Origin headers for defense-in-depth against side-channel attacks (e.g. Spectre)
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  // Sentinel: Enable Cross-Origin Isolation to protect against side-channel attacks (like Spectre)
  // Using credentialless instead of require-corp to avoid breaking external HDRI assets from unauthenticated CDNs.
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "credentialless",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
