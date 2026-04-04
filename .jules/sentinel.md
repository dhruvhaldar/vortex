## 2024-03-23 - Add HTTP Security Headers
**Vulnerability:** Missing HTTP Security Headers (Defense in Depth)
**Learning:** This Next.js web application was missing standard security headers which provide an additional layer of protection against XSS, clickjacking, and content sniffing.
**Prevention:** Always define a custom headers function in `next.config.ts` or `next.config.js` to enforce strict security headers, especially Content-Security-Policy.

## 2024-04-02 - Remove Redundant CSP Directives
**Vulnerability:** Redundant CSP Directives (Security Theater)
**Learning:** Including redundant CSP directives like `block-all-mixed-content` when `upgrade-insecure-requests` is present is unnecessary security theater that clutters the policy without providing real benefit, as modern browsers deprecate or ignore `block-all-mixed-content` in favor of upgrading.
**Prevention:** Always verify that CSP directives are strictly necessary and non-overlapping to avoid bloated and confusing security policies.

## 2024-05-15 - Disable DNS Prefetching
**Vulnerability:** Information Leakage via DNS Prefetching
**Learning:** Next.js applications may default to allowing DNS prefetching. Explicitly setting the `X-DNS-Prefetch-Control` HTTP response header to `off` is a valid privacy and security enhancement that helps prevent potential information leakage via background DNS prefetching.
**Prevention:** Set `X-DNS-Prefetch-Control` to `off` in security headers configuration.
