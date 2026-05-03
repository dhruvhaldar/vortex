
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
