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