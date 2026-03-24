## 2024-05-18 - Keyboard Focus Rings on Dark WebGL Backgrounds
**Learning:** Default browser focus rings are often invisible or have insufficient contrast against dark, full-screen WebGL scenes (like Three.js or React Three Fiber canvases).
**Action:** Always explicitly define `focus-visible` styles with a high-contrast ring (e.g., `focus-visible:ring-4 focus-visible:ring-white/40`) for overlay UI elements in 3D/WebGL applications.

## 2024-05-18 - Loading Feedback for 3D Scenes
**Learning:** Using `<Suspense fallback={null}>` inside a React Three Fiber `<Canvas>` without an external loading indicator causes a prolonged blank or un-interactive screen while large 3D assets (e.g., GLTF models) are downloading and parsing. This leaves the user without feedback.
**Action:** Always include a visual loading indicator outside the `<Canvas>`, such as `@react-three/drei`'s `<Loader />`, to provide clear progress feedback and improve perceived performance and accessibility.
