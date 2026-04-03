## 2024-05-18 - Keyboard Focus Rings on Dark WebGL Backgrounds
**Learning:** Default browser focus rings are often invisible or have insufficient contrast against dark, full-screen WebGL scenes (like Three.js or React Three Fiber canvases).
**Action:** Always explicitly define `focus-visible` styles with a high-contrast ring (e.g., `focus-visible:ring-4 focus-visible:ring-white/40`) for overlay UI elements in 3D/WebGL applications.

## 2024-05-18 - Loading Feedback for 3D Scenes
**Learning:** Using `<Suspense fallback={null}>` inside a React Three Fiber `<Canvas>` without an external loading indicator causes a prolonged blank or un-interactive screen while large 3D assets (e.g., GLTF models) are downloading and parsing. This leaves the user without feedback.
**Action:** Always include a visual loading indicator outside the `<Canvas>`, such as `@react-three/drei`'s `<Loader />`, to provide clear progress feedback and improve perceived performance and accessibility.

## 2024-05-18 - Semantic Landmarks for 3D Canvas HTML Overlays
**Learning:** Screen readers struggle to navigate HTML elements layered over a WebGL context, such as those rendered inside `@react-three/drei`'s `<ScrollControls>` or `<Scroll html>`, because the structure can appear flat or disconnected from the document flow.
**Action:** Always explicitly define semantic landmarks, such as using `aria-labelledby` on `<section>` elements, to connect them to their corresponding heading elements and create clear navigational blocks for screen readers.

## 2026-04-03 - Accessible Unicode Arrows
**Learning:** Screen readers often mispronounce, skip, or read confusing descriptions for unicode symbols like arrows (`↓`, `↑`) used in keyboard hints, degrading the experience for visually impaired users.
**Action:** Always wrap unicode symbols in `<span aria-hidden="true">` and provide explicitly readable descriptions using `<span className="sr-only">` alongside them inside `<kbd>` or hint wrappers.
