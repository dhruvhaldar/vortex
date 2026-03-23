## 2024-03-23 - Add HTTP Security Headers
**Vulnerability:** Missing HTTP Security Headers (Defense in Depth)
**Learning:** This Next.js web application was missing standard security headers which provide an additional layer of protection against XSS, clickjacking, and content sniffing.
**Prevention:** Always define a custom headers function in `next.config.ts` or `next.config.js` to enforce strict security headers, especially Content-Security-Policy.
