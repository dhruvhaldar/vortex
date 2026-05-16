
## 2024-05-18 - Respecting Reduced Motion Preferences in Overlays
**Learning:** Continuous looping animations, such as `animate-bounce` used for "Scroll to explore" indicators, can cause nausea or dizziness for users with vestibular disorders, especially when layered over dynamic or moving 3D scenes (like React Three Fiber).
**Action:** Always wrap continuous CSS animations with the `motion-safe:` variant (e.g., `motion-safe:animate-bounce`) to ensure the animation only plays for users who have not requested reduced motion in their OS settings.

## 2026-04-02 - Exposing Critical Interaction Instructions
**Learning:** Applying `aria-hidden="true"` to a container block hides vital interaction cues from screen readers (e.g. "Scroll to explore"), leaving visually impaired users without knowledge of how to operate full-page scroll-driven applications.
**Action:** Always ensure textual instructions remain exposed to screen readers. Apply `aria-hidden="true"` strictly to the decorative elements (like SVG icons) within the instruction block, rather than the parent container.

## 2024-05-18 - Respecting Reduced Motion Preferences in Programmatic JS Scrolling
**Learning:** Programmatic JavaScript scrolling (e.g., using `Element.scrollBy({ behavior: 'smooth' })` or similar methods) completely ignores CSS `@media (prefers-reduced-motion: reduce)` rules. This can cause significant accessibility issues and vestibular discomfort for users who have requested reduced motion but still trigger JavaScript-driven navigation or scroll events.
**Action:** When implementing any programmatic scrolling or animation in JavaScript, always manually check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and fallback to an instant update (e.g., `behavior: 'auto'`) if true.
## 2024-05-18 - Throttling ARIA Updates in Continuous Render Loops
**Learning:** When implementing custom visual scroll progress bars in a continuous render loop (like React Three Fiber's `useFrame`), naive updates to `aria-valuenow` can occur 60+ times per second. This high frequency overwhelms screen readers, causing degraded accessibility performance and unintelligible announcements.
**Action:** Always add `role="progressbar"` and related `aria-*` attributes (`aria-valuemin`, `aria-valuemax`, `aria-label`). To prevent screen reader spam, update the `aria-valuenow` attribute programmatically via a `ref` and throttle the updates—for example, by only applying the update when the integer percentage actually changes.

## 2024-05-18 - Handling Loading States with Reduced Motion
**Learning:** When disabling animations (like loading spinners) for users who request reduced motion, relying purely on `sr-only` text leaves sighted users with a frozen, uninformative UI.
**Action:** Ensure that when animations are disabled, a clear textual equivalent (like "Loading...") is exposed visually using utility classes like `motion-reduce:not-sr-only`.

## 2024-05-18 - Preventing False Affordance on Static Information Cards
**Learning:** Adding hover states (like background color changes) to non-interactive informational cards creates a "false affordance", making users think the element is clickable or interactive when it is not. This leads to user frustration and confusion. Additionally, using solid high-opacity backgrounds for overlays in 3D scenes blocks the visualization.
**Action:** Remove hover states from purely informational elements. Use a glassmorphism effect (e.g., `bg-black/60 backdrop-blur-md`) for text panels overlaying dynamic 3D scenes to ensure readability while preserving context.

## 2024-05-18 - Mirroring Structural Hover States for Keyboard Users
**Learning:** While decorative micro-animations (like `group-hover:-translate-y-1`) are often properly mirrored with `group-focus-visible`, the base structural hover states on the parent container (like `hover:bg-gray-200` or `hover:text-white`) are frequently forgotten for keyboard focus states. This creates a disparity in visual feedback between mouse and keyboard users.
**Action:** Always mirror parent container structural hover states (background color, text color) with the corresponding `focus-visible:` utility classes, in addition to mirroring the internal micro-animations.

## 2024-05-18 - Ensuring Custom Font Variables Apply in Global CSS
**Learning:** When using Next.js custom fonts with Tailwind v4 `@theme inline` blocks, if `globals.css` has a hardcoded `body { font-family: Arial... }`, it will silently override the custom font (like Geist) causing the entire app to render in standard system fonts, defeating the UX design.
**Action:** Always ensure the global CSS body font-family utilizes the corresponding CSS variable mapped to the custom font (e.g., `font-family: var(--font-sans), sans-serif;`) to preserve visual polish.

## 2024-05-18 - Clarifying Domain Acronyms for Inclusivity
**Learning:** Using domain-specific acronyms like "CFD" or "R3F" without expansion can exclude users unfamiliar with the terminology and cause confusion for screen readers.
**Action:** Wrap domain acronyms in an `<abbr>` tag with a clear `title` attribute (e.g., `<abbr title="Computational Fluid Dynamics" className="cursor-help underline decoration-dotted underline-offset-2">CFD</abbr>`) to provide an accessible hover tooltip and semantic meaning for assistive technologies.

## 2024-05-09 - Avoid Screen Reader Spam on Scroll Progress Bars
**Learning:** Updating `aria-valuenow` on a scroll progress bar inside a `useFrame` or `requestAnimationFrame` loop rapidly fires screen reader updates on every frame. This creates overwhelming noise for assistive technologies, completely drowning out the actual content of the page.
**Action:** For continuous scroll indicators, treat them as purely visual/decorative and hide them with `aria-hidden="true"`. Assistive technologies already have their own native ways of understanding document scroll position.
## 2024-05-10 - Immersive Selection and Tactile Keyboard Hints
**Learning:** In immersive WebGL applications with dark themes, default browser text selection (often bright blue) breaks the aesthetic. Additionally, keyboard shortcut hints <kbd> are more quickly recognized by users when styled with physical affordances (borders, bottom shadows) rather than flat backgrounds.
**Action:** Always apply custom selection: utility classes to root layouts in immersive apps, and apply tactile shadow/border styles to <kbd> elements to improve scanability.

## 2024-05-18 - Consistent Programmatic Focus for Scroll Sections
**Learning:** When using scroll-driven interactive experiences (like R3F with useScroll), missing `tabIndex={-1}` and `focus:outline-none` on some major section headings leads to inconsistent structural accessibility. Without these, it is impossible to programmatically shift screen reader focus to those sections consistently (e.g. from a scroll button), breaking the accessibility tree predictability.
**Action:** Ensure all major section headings in scrollable experiences have `tabIndex={-1}` and `focus:outline-none` so they can safely receive programmatic focus without displaying ugly browser focus rings.
## 2024-05-15 - Enhancing keyboard hints and abbreviation accessibility
**Learning:** Sighted keyboard users and screen reader users often miss out on `<abbr>` title expansions because they cannot hover. Furthermore, inline keyboard hints (`<kbd>`) blend into the text if they lack physical affordance.
**Action:** Always add `tabIndex={0}` and clear `focus-visible` styles to `<abbr>` elements to ensure keyboard accessibility. Enhance `<kbd>` elements with thicker bottom borders (e.g., `border-b-[3px]`) to simulate physical keys, improving scannability.

## 2024-05-18 - Avoiding Nested Interactive Elements
**Learning:** Placing a focusable element (like an `<abbr tabIndex={0}>`) inside another interactive element (like an `<a>` or `<button>`) creates invalid HTML. This confuses screen readers and creates a false affordance, as the inner element appears clickable for navigation but may not behave correctly.
**Action:** Always ensure that interactive elements are not nested. Restructure the HTML to keep interactive components as siblings or separate them logically, maintaining visual styling with structural containers (like `<div>` pills).
