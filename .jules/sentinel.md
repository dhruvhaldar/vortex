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
## 2025-04-30 - Harden Permissions-Policy further\n**Vulnerability:** Permissive access to compute-pressure, direct-sockets, and attribution-reporting APIs (Defense in Depth)\n**Learning:** Expanding the Permissions-Policy HTTP header to explicitly disable experimental APIs like compute-pressure, direct-sockets, and attribution-reporting further reduces the application's attack surface and mitigates potential side-channel or fingerprinting risks.\n**Prevention:** Always maintain a strict and comprehensive Permissions-Policy in HTTP headers to prevent unauthorized use of modern browser APIs.

## 2024-05-04 - Strict CSP for Localized Assets
**Vulnerability:** Loading heavy 3D assets from external sources requires broad `connect-src` CSP directives, increasing the risk of data exfiltration or supply chain attacks.
**Learning:** React Three Fiber's `<Environment>` component can load local HDR files instead of using `preset` names that fetch from external CDNs, allowing us to remove external domains from the CSP.
**Prevention:** Always host external assets (like HDRs, fonts, and scripts) locally and configure `next.config.ts` to restrict the CSP `connect-src` solely to `'self'` and required data URIs.

## 2025-05-07 - Upgrade COEP to require-corp
**Vulnerability:** Weaker Cross-Origin-Embedder-Policy (`credentialless`)
**Learning:** Previously, `credentialless` was used to accommodate external HDRI assets from unauthenticated CDNs. Now that assets are loaded locally, we can upgrade to `require-corp` to enforce stricter cross-origin isolation and enhance defense-in-depth against side-channel attacks (like Spectre).
**Prevention:** Always enforce the strictest possible COEP (`require-corp`) when all required assets are either same-origin or explicitly provide appropriate CORS/CORP headers.
## 2025-05-08 - Harden Permissions-Policy
**Vulnerability:** Permissive access to window-placement and ch-ua-form-factors APIs (Defense in Depth)
**Learning:** Expanding the Permissions-Policy HTTP header to explicitly disable the deprecated window-placement API and ch-ua-form-factors API (now window-management) further reduces the application's attack surface and mitigates potential side-channel or fingerprinting risks.
**Prevention:** Always maintain a strict and comprehensive Permissions-Policy in HTTP headers to prevent unauthorized use of modern browser APIs.

## 2024-05-16 - Enforce Safe Versions for Transitive Dependencies
**Vulnerability:** Several high-severity vulnerabilities in transitive dependencies (`flatted`, `minimatch`, `picomatch`) allow for DoS and ReDoS attacks.
**Learning:** `pnpm audit` sometimes fails to flag nested dependency issues that `npm audit` catches. Additionally, automated lockfile updates alone may not resolve vulnerabilities deeply nested in the dependency tree.
**Prevention:** Use the `pnpm.overrides` field in `package.json` to explicitly enforce minimum safe versions for transitive dependencies, resolving deep tree vulnerabilities without waiting for direct dependency updates.

## 2024-05-16 - Enforce Package Manager and Remove Stale Lockfiles
**Vulnerability:** The repository contained an outdated `package-lock.json` with known high-severity vulnerabilities alongside `pnpm-lock.yaml`. If a developer or CI pipeline accidentally used `npm install` instead of `pnpm`, vulnerable dependency versions would be installed, exposing the application to DoS/ReDoS attacks.
**Learning:** Stale or duplicate lockfiles from different package managers create a supply chain risk through "dependency confusion" within the development lifecycle.
**Prevention:** Always delete unused lockfiles (e.g., `package-lock.json` in a pnpm project) and define the `packageManager` field in `package.json` to enforce the use of the correct package manager (e.g., Corepack), ensuring deterministic and secure dependency resolution.

## 2026-05-10 - Harden Permissions-Policy further
**Vulnerability:** Permissive access to FedCM, OTP credentials, storage access, and keyboard map APIs (Defense in Depth)
**Learning:** Expanding the Permissions-Policy HTTP header to explicitly disable unused APIs like `identity-credentials-get`, `otp-credentials`, `storage-access`, and `keyboard-map` further reduces the application's attack surface and mitigates potential side-channel or fingerprinting risks.
**Prevention:** Always maintain a strict and comprehensive Permissions-Policy in HTTP headers to prevent unauthorized use of modern browser APIs.

## 2026-05-11 - Harden Permissions-Policy against Fingerprinting
**Vulnerability:** Permissive access to High-Entropy User-Agent Client Hints and new browser APIs (Defense in Depth)
**Learning:** This Next.js web application did not explicitly restrict High-Entropy User-Agent Client Hints (`ch-ua-arch`, `ch-ua-bitness`, `ch-ua-full-version`, `ch-ua-full-version-list`, `ch-ua-model`, `ch-ua-wow64`) and new APIs like `smart-card` and `captured-surface-control` through the `Permissions-Policy` header. Leaving these enabled when not required expands the attack surface, potentially allowing compromised third-party scripts to perform high-fidelity device fingerprinting.
**Prevention:** Always maintain a strict and comprehensive `Permissions-Policy` in HTTP headers. If an application does not require specific high-entropy client hints or new device capabilities, explicitly disable them to prevent unauthorized use and mitigate fingerprinting risks.

## 2025-05-12 - Upgrade Next.js to fix DoS and Proxy bypass vulnerabilities
**Vulnerability:** Outdated next dependency (<16.2.5)
**Learning:** Next.js versions < 16.2.5 contained multiple high and moderate severity vulnerabilities including a Denial of Service with Server Components, cross-site scripting in App Router applications using CSP nonces, and multiple Middleware/Proxy bypasses. Upgrading to a patched version resolves these vulnerabilities.
**Prevention:** Regularly run `pnpm audit` and upgrade core dependencies like `next` to ensure the application is protected against known CVEs. Use `pnpm update` or manually bump versions in `package.json` to apply critical security patches.

## 2026-05-14 - Implement RFC 9116 security.txt
**Vulnerability:** Missing standardized vulnerability disclosure mechanism (RFC 9116)
**Learning:** This Next.js web application lacked a `security.txt` file. Without a standardized way for security researchers to report vulnerabilities, ethical hackers might struggle to contact the right team, potentially leading to public disclosure or unpatched exploits.
**Prevention:** Always implement a `security.txt` file under `.well-known/` (as per RFC 9116) to provide a clear, established communication channel for reporting security issues.

## 2026-05-15 - Implement Subresource Integrity (SRI)
**Vulnerability:** Missing Subresource Integrity (SRI) for scripts and styles (Defense in Depth)
**Learning:** This Next.js application was loading resources without Subresource Integrity checks. While loading assets locally mitigates some risks, enabling SRI provides an additional layer of defense. If a CDN is compromised or an attacker manages to alter static assets on the host, the browser will refuse to execute the tampered files.
**Prevention:** Always enable Subresource Integrity (SRI) in `next.config.ts` via the `experimental.sri` flag to ensure that the browser verifies the cryptographic hashes of fetched resources, protecting against asset tampering.
## 2026-06-20 - Remove Unused Dependencies
**Vulnerability:** Larger attack surface from unused dependencies
**Learning:** This Next.js web application had the `leva` package installed as a dependency in `package.json`, but it was never imported or used in the application. Leaving unused third-party dependencies in the project increases the application's attack surface, as any vulnerabilities discovered in those dependencies (or their transitive dependencies) could potentially affect the application or its build process.
**Prevention:** Regularly audit the project's dependencies and remove any packages that are no longer actively used to minimize the attack surface and potential for supply chain attacks.

## 2026-06-21 - Remove Unused Dependencies
**Vulnerability:** Larger attack surface from unused dependencies
**Learning:** This Next.js web application had the `framer-motion` package installed as a dependency in `package.json`, but it was never imported or used in the application. Leaving unused third-party dependencies in the project increases the application's attack surface, as any vulnerabilities discovered in those dependencies (or their transitive dependencies) could potentially affect the application or its build process.
**Prevention:** Regularly audit the project's dependencies and remove any packages that are no longer actively used to minimize the attack surface and potential for supply chain attacks.

## 2026-05-20 - Harden Permissions-Policy against Network/Device Fingerprinting
**Vulnerability:** Permissive access to pointer-lock and Network Information / Device Memory client hints (Defense in Depth)
**Learning:** This Next.js web application did not explicitly restrict the pointer-lock API and various Network/Device client hints (`ch-device-memory`, `ch-downlink`, `ch-ect`, `ch-rtt`, `ch-save-data`, `ch-viewport-width`, `ch-width`) in the `Permissions-Policy` header. Leaving these enabled when not required allows third-party scripts to potentially perform device fingerprinting based on network conditions and device memory.
**Prevention:** Always maintain a strict and comprehensive `Permissions-Policy` in HTTP headers. If an application does not require specific high-entropy client hints or pointer-lock capabilities, explicitly disable them to prevent unauthorized use and mitigate fingerprinting risks.

## 2026-05-21 - Harden Permissions-Policy against NFC and Privacy Sandbox
**Vulnerability:** Permissive access to Web NFC and new Privacy Sandbox APIs (Defense in Depth)
**Learning:** This Next.js web application did not explicitly restrict the Web NFC API (`nfc`) and additional Google Privacy Sandbox APIs (`shared-storage`, `shared-storage-select-url`, `private-aggregation`) in the `Permissions-Policy` header. Leaving these enabled when not required allows third-party scripts to potentially interact with NFC devices or participate in covert cross-site tracking.
**Prevention:** Always maintain a strict and comprehensive `Permissions-Policy` in HTTP headers. If an application does not require specific hardware APIs like NFC or new Privacy Sandbox features, explicitly disable them to prevent unauthorized use and mitigate tracking risks.

## 2025-05-23 - Harden Content-Security-Policy against unused fetch types
**Vulnerability:** Permissive manifest and prefetch fetching (Defense in Depth)
**Learning:** The Content-Security-Policy did not explicitly restrict `manifest-src` or `prefetch-src`. Leaving these unrestricted could allow an attacker to exfiltrate data or perform request forgery via web app manifests or prefetching if other injection vulnerabilities exist.
**Prevention:** Always restrict unused CSP directives like `manifest-src` to `'none'` and limit `prefetch-src` to `'self'` for enhanced defense-in-depth.

## 2026-05-26 - Enforce Package Manager via preinstall script
**Vulnerability:** Bypass of package manager overrides leading to vulnerable dependencies (Supply Chain Risk)
**Learning:** While the packageManager field is defined in package.json, developers without Corepack enabled could still run npm install. This would ignore pnpm.overrides, silently installing vulnerable transitive dependencies and creating a conflicting package-lock.json. Additionally, misleading npm instructions in the README exacerbated this risk.
**Prevention:** Always enforce the intended package manager at the npm lifecycle level by adding a preinstall script (e.g., npx only-allow pnpm) and ensure documentation consistently reflects the secure installation method.

## 2026-05-28 - Harden Permissions-Policy against UI Preference Fingerprinting and Vibration API
**Vulnerability:** Permissive access to Vibration API and UI Preference Client Hints (Defense in Depth)
**Learning:** This Next.js web application did not explicitly restrict the Vibration API (`vibration`) and UI/Display Preference client hints (`ch-dpr`, `ch-viewport-height`, `ch-prefers-color-scheme`, `ch-prefers-reduced-motion`, `ch-prefers-reduced-transparency`) in the `Permissions-Policy` header. Leaving these enabled when not required allows third-party scripts to potentially trigger unauthorized device vibrations and perform high-fidelity device fingerprinting based on detailed user preferences and display characteristics.
**Prevention:** Always maintain a strict and comprehensive `Permissions-Policy` in HTTP headers. If an application does not require specific hardware APIs like Vibration or detailed UI preference client hints, explicitly disable them to prevent unauthorized use and mitigate fingerprinting risks.
