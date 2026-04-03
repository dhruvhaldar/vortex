## 2024-03-23 - Add HTTP Security Headers
**Vulnerability:** Missing HTTP Security Headers (Defense in Depth)
**Learning:** This Next.js web application was missing standard security headers which provide an additional layer of protection against XSS, clickjacking, and content sniffing.
**Prevention:** Always define a custom headers function in `next.config.ts` or `next.config.js` to enforce strict security headers, especially Content-Security-Policy.

## 2024-04-02 - Remove Redundant CSP Directives
**Vulnerability:** Redundant CSP Directives (Security Theater)
**Learning:** Including redundant CSP directives like `block-all-mixed-content` when `upgrade-insecure-requests` is present is unnecessary security theater that clutters the policy without providing real benefit, as modern browsers deprecate or ignore `block-all-mixed-content` in favor of upgrading.
**Prevention:** Always verify that CSP directives are strictly necessary and non-overlapping to avoid bloated and confusing security policies.

## 2024-05-15 - Fix CSP blocking Three.js and Drei Assets
**Vulnerability:** Strict CSP blocking essential 3D assets and WebAssembly
**Learning:** React Three Fiber, Drei, and Three.js frequently rely on remote external assets (like HDRIs hosted on raw.githack.com) and `data:` URIs. A strict `default-src 'self'` policy without an explicit `connect-src` will block these, crashing the WebGL scene. Furthermore, some underlying 3D libraries may use WebAssembly, requiring `'wasm-unsafe-eval'` in `script-src`.
**Prevention:** When setting Content-Security-Policy in Next.js applications featuring R3F/Three.js, always explicitly configure `connect-src` to allow necessary external CDNs, `data:`, and `blob:` URIs, and include `'wasm-unsafe-eval'` in `script-src` to ensure 3D scenes render without CSP violations.
