## 2024-05-18 - Keyboard Focus Rings on Dark WebGL Backgrounds
**Learning:** Default browser focus rings are often invisible or have insufficient contrast against dark, full-screen WebGL scenes (like Three.js or React Three Fiber canvases).
**Action:** Always explicitly define `focus-visible` styles with a high-contrast ring (e.g., `focus-visible:ring-4 focus-visible:ring-white/40`) for overlay UI elements in 3D/WebGL applications.

## 2024-05-18 - Loading Feedback for 3D Scenes
**Learning:** Using `<Suspense fallback={null}>` inside a React Three Fiber `<Canvas>` without an external loading indicator causes a prolonged blank or un-interactive screen while large 3D assets (e.g., GLTF models) are downloading and parsing. This leaves the user without feedback.
**Action:** Always include a visual loading indicator outside the `<Canvas>`, such as `@react-three/drei`'s `<Loader />`, to provide clear progress feedback and improve perceived performance and accessibility.

## 2024-05-18 - Semantic Landmarks for 3D Canvas HTML Overlays
**Learning:** Screen readers struggle to navigate HTML elements layered over a WebGL context, such as those rendered inside `@react-three/drei`'s `<ScrollControls>` or `<Scroll html>`, because the structure can appear flat or disconnected from the document flow.
**Action:** Always explicitly define semantic landmarks, such as using `aria-labelledby` on `<section>` elements, to connect them to their corresponding heading elements and create clear navigational blocks for screen readers.

## 2025-01-28 - Interactive Scroll Indicators
**Learning:** Static visual cues like bouncing "Scroll Down" arrows or mouse icons are common, but leaving them as non-interactive elements can cause user frustration, especially if they click them expecting an action.
**Action:** Convert prominent visual scroll indicators into fully interactive `<button>` elements with `onClick` handlers to programmatically scroll the container, including proper hover states, ARIA labels, and `focus-visible` styling for accessibility.

## 2025-04-07 - Button ARIA Labeling and Contrast
**Learning:** Using `aria-label` on a button completely overrides its internal text content. This meant our visual keyboard shortcut hints (`<kbd>↓</kbd>`) were completely hidden from screen readers. Additionally, low opacity (`text-white/70`) on text inside slightly translucent containers (`bg-white/20`) often fails WCAG contrast requirements.
**Action:** When a button contains complex content (like visual keys or icons + text), avoid `aria-label` on the parent. Instead, use a visually hidden `sr-only` span for the full description and apply `aria-hidden="true"` to the visual elements that shouldn't be double-read. Ensure text inside translucent containers maintains high opacity for contrast.
## 2025-04-10 - Multi-page Scroll Loops
**Learning:** Linear, multi-page scroll experiences often leave users stranded at the bottom of the page, forcing them to manually scroll all the way back up to restart or re-experience the content. This creates friction and a tedious end to the experience.
**Action:** Always provide a quick, programmatic "Back to Start" mechanism (e.g., a button calling `scrollTo({ top: 0, behavior: 'smooth' })`) at the conclusion of multi-page scroll sequences to create a satisfying loop and improve overall usability.

## 2025-05-10 - Hover Animation Stability
**Learning:** Animating an entire clickable button (e.g., using `animate-bounce` directly on the button element) creates a moving target, which can be frustrating to click and makes the interface feel unstable.
**Action:** When implementing animated indicators inside buttons (like a scrolling mouse or pointing arrow), apply the animation strictly to the internal icon element using group hover states (e.g., parent `group`, child `group-hover:animate-bounce`) rather than animating the entire parent container. This keeps the interactive hit area stable.

## 2025-05-15 - Managing Focus during Programmatic Scroll
**Learning:** When programmatically scrolling back to the top of a multi-page scroll experience, keyboard focus remains stuck at the bottom. This leaves keyboard and screen reader users stranded, forcing them to manually tab backwards through the entire document to continue interacting.
**Action:** When implementing a "Back to Start" programmatic scroll, always move keyboard focus to an appropriate top-level element (like the main `<h1>` with `tabIndex={-1}`). Crucially, use `.focus({ preventScroll: true })` so the browser doesn't instantly snap the scroll position back, which would ruin the smooth visual scroll animation.
