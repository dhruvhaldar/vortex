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

## 2024-06-25 - Restrict Powerful Browser APIs
**Vulnerability:** Permissive access to powerful browser APIs (Defense in Depth)
**Learning:** This Next.js web application did not explicitly restrict modern, powerful browser APIs (such as Payment Request, WebUSB, Web Bluetooth, and Screen Capture) through the `Permissions-Policy` header. Leaving these enabled when not required expands the attack surface, potentially allowing compromised third-party scripts to access sensitive device hardware or payment interfaces.
**Prevention:** Always maintain a strict and comprehensive `Permissions-Policy` in HTTP headers. If an application does not require specific powerful web capabilities (like `payment=()`, `usb=()`, `bluetooth=()`, or `display-capture=()`), explicitly disable them to prevent unauthorized use.

## 2024-07-20 - Restrict Hardware Sensors in Permissions-Policy
**Vulnerability:** Unrestricted access to hardware sensors (accelerometer, gyroscope, etc.)
**Learning:** WebGL applications are particularly susceptible to device fingerprinting. Leaving hardware sensors accessible when not needed increases the attack surface for side-channel attacks and fingerprinting.
**Prevention:** Always disable unused hardware sensors in the Permissions-Policy header, such as accelerometer=(), gyroscope=(), magnetometer=(), midi=(), publickey-credentials-get=(), and sync-xhr=().
## 2024-10-27 - Harden Permissions-Policy further
**Vulnerability:** Unnecessary media and device capabilities left enabled (Defense in Depth)
**Learning:** Expanding the `Permissions-Policy` HTTP header to explicitly disable unused APIs like `battery`, `autoplay`, `fullscreen`, `picture-in-picture`, `screen-wake-lock`, `web-share`, and `xr-spatial-tracking` reduces the application's attack surface and mitigates potential privacy leakage risks.
**Prevention:** To further harden the HTTP `Permissions-Policy` header for defense-in-depth, explicitly disable unused media and device capabilities.
## 2024-11-20 - Further Harden Permissions-Policy and add X-Download-Options
**Vulnerability:** Permissive access to clipboard, serial, gamepad, and window management APIs, and legacy browsers potentially directly executing downloaded files (Defense in Depth)
**Learning:** Expanding the `Permissions-Policy` HTTP header to explicitly disable unused APIs like `clipboard-read`, `clipboard-write`, `serial`, `gamepad`, and `window-management` further reduces the application's attack surface and mitigates potential data extraction/exfiltration risks. Adding the `X-Download-Options: noopen` header prevents legacy browsers from executing downloaded files in the application's context.
**Prevention:** Always maintain a strict and comprehensive `Permissions-Policy` and `X-Download-Options` in HTTP headers to prevent unauthorized use of modern browser APIs and legacy browser exploits.
## 2024-12-05 - Add Origin-Agent-Cluster HTTP Header
**Vulnerability:** Missing strict origin-keyed isolation
**Learning:** This Next.js web application was missing the `Origin-Agent-Cluster` header, which explicitly enforces strict origin-keyed isolation and prevents `document.domain` relaxation, strengthening the application's defense against cross-origin side-channel attacks.
**Prevention:** Always include the `Origin-Agent-Cluster: ?1` header to enforce strict origin isolation and improve defense-in-depth against cross-origin vulnerabilities.
## 2025-02-27 - Tighten CSP base-uri and form-action
**Vulnerability:** Permissive Content-Security-Policy allowed `base-uri` and `form-action` to default to `'self'`.
**Learning:** In applications that do not use HTML `<base>` tags or native HTML `<form>` submissions (common in SPAs and 3D web applications like this one), leaving `base-uri` and `form-action` as `'self'` or omitted provides an unnecessary attack surface. An attacker could potentially inject a malicious `<base>` tag (altering relative URLs) or perform rogue form submissions if an XSS or HTML injection vulnerability exists elsewhere. Setting these to `'none'` eliminates this class of attacks entirely.
**Prevention:** Always restrict `base-uri` and `form-action` to `'none'` in the Content-Security-Policy unless the application specifically relies on base tags or native form actions.
## 2025-04-25 - Remove Unnecessary CDN from CSP
**Vulnerability:** Permissive Content-Security-Policy allowed connections to an unused external domain (`raw.githack.com`).
**Learning:** Expanding `connect-src` to include domains that are no longer actively used by the application unnecessarily increases the attack surface. An attacker could potentially abuse this if another vulnerability allowed them to execute scripts or fetch data from that origin.
**Prevention:** Regularly audit the `Content-Security-Policy` and remove any external domains that are not strictly required for the application's functionality.
## 2024-05-20 - Further Harden Permissions-Policy
**Vulnerability:** Permissive access to ambient-light-sensor, encrypted-media, idle-detection, local-fonts, and speaker-selection APIs (Defense in Depth)
**Learning:** Expanding the Permissions-Policy HTTP header to explicitly disable unused APIs like ambient-light-sensor, encrypted-media, idle-detection, local-fonts, and speaker-selection further reduces the application's attack surface and mitigates potential side-channel or fingerprinting risks.
**Prevention:** Always maintain a strict and comprehensive Permissions-Policy in HTTP headers to prevent unauthorized use of modern browser APIs.

## 2024-05-25 - Add Sandbox Directive to CSP
**Vulnerability:** Permissive Content-Security-Policy without a sandbox directive (Defense in Depth)
**Learning:** Adding a `sandbox` directive to the Content-Security-Policy limits the actions that the page is allowed to take. Even if an attacker finds an XSS vulnerability, the `sandbox` directive can restrict their ability to perform certain malicious actions like submitting forms or opening popups (unless explicitly allowed).
**Prevention:** Always consider adding a `sandbox` directive to the Content-Security-Policy to enforce strict limitations on page capabilities, enhancing defense-in-depth against XSS and other injection attacks.
