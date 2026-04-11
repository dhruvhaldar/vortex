## 2024-03-23 - Add HTTP Security Headers
**Vulnerability:** Missing HTTP Security Headers (Defense in Depth)
**Learning:** This Next.js web application was missing standard security headers which provide an additional layer of protection against XSS, clickjacking, and content sniffing.
**Prevention:** Always define a custom headers function in `next.config.ts` or `next.config.js` to enforce strict security headers, especially Content-Security-Policy.

## 2024-04-02 - Remove Redundant CSP Directives
**Vulnerability:** Redundant CSP Directives (Security Theater)
**Learning:** Including redundant CSP directives like `block-all-mixed-content` when `upgrade-insecure-requests` is present is unnecessary security theater that clutters the policy without providing real benefit, as modern browsers deprecate or ignore `block-all-mixed-content` in favor of upgrading.
**Prevention:** Always verify that CSP directives are strictly necessary and non-overlapping to avoid bloated and confusing security policies.

## 2024-04-10 - Fix CSP Blocking 3D Assets
**Vulnerability:** CSP rules blocked fetching 3D assets causing the WebGL scene to crash.
**Learning:** Adding strict security policies (CSP) can inadvertently break third-party external integrations like Drei's Environment which fetches HDRI images from `raw.githubusercontent.com`.
**Prevention:** Whenever you implement a new feature relying on external CDNs or external assets, ensure the specific domains (e.g. `raw.githubusercontent.com`) are explicitly allowed in the `connect-src` or `img-src` directives of the Content-Security-Policy.

## 2024-05-15 - Dependency Vulnerability (CVE-2026-23869)
**Vulnerability:** Next.js Denial of Service with Server Components (GHSA-q4gf-8mx6-v5v3)
**Learning:** Outdated dependencies can harbor high-severity vulnerabilities that allow for Denial of Service attacks when malicious HTTP requests trigger excessive CPU usage during deserialization.
**Prevention:** Regularly run `pnpm audit` to detect known vulnerabilities in the dependency tree and update affected packages to their patched versions proactively.
