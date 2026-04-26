## 2024-03-23 - Prevent memory leaks in useFrame loop
**Learning:** Three.js object instantiation inside `useFrame` can cause significant Garbage Collection pauses, especially when using things like `new THREE.Vector3()` or `.clone()` on every frame.
**Action:** Always pre-allocate Three.js objects outside of the render loop (module scope) and reuse them using methods like `.copy()`, `.lerpVectors()`, or `.slerp()`.

## 2024-05-24 - Avoid DoubleSide on closed geometry
**Learning:** Using `side: THREE.DoubleSide` on closed geometry like generated tubes disables backface culling, effectively doubling the fragment shader workload without any visual benefit.
**Action:** Default to `THREE.FrontSide` for all closed geometries, and only enable `DoubleSide` when explicitly rendering open surfaces (like planes or unclosed shells).

## 2024-11-20 - Avoid Object3D.lookAt in render loop
**Learning:** Calling `Object3D.lookAt()` (including `Camera.lookAt()`) internally calls `updateWorldMatrix(true, false)`. Doing this inside `useFrame` forces expensive, synchronous matrix recalculations on the object and its ancestors every frame, bypassing Three.js's optimized rendering phase updates.
**Action:** When computing rotations dynamically (like smooth camera tracking), construct a rotation matrix directly via `new THREE.Matrix4().lookAt(eye, target, up)` and extract the quaternion with `setFromRotationMatrix()`. This avoids both matrix overhead and unnecessary quaternion copying.

## 2025-02-13 - Avoid manual instantiation of materials to prevent WebGL memory leaks
**Learning:** Manual instantiation of Three.js materials (e.g., `new THREE.ShaderMaterial()`) inside React components bypasses React Three Fiber's automatic memory management. When the component unmounts, these materials are not disposed, leading to WebGL memory leaks on the GPU.
**Action:** Always use JSX equivalents (e.g., `<shaderMaterial />`) for dynamically created materials so R3F can automatically call `.dispose()` on unmount. Memoize the `uniforms` object to provide a stable reference and avoid re-renders.

## 2026-04-01 - Use powerPreference: high-performance for heavy WebGL scenes
**Learning:** Heavy WebGL scenes utilizing post-processing (SSAO, Bloom, etc.) can suffer severe framerate degradation on dual-GPU devices if the browser incorrectly defaults to the integrated, low-power GPU to save battery.
**Action:** Always explicitly set `powerPreference: 'high-performance'` in the WebGL context (e.g., `<Canvas gl={{ powerPreference: 'high-performance' }}>`) to instruct the browser to use the dedicated discrete GPU, drastically improving performance.

## 2026-04-06 - Cap Device Pixel Ratio for post-processing performance
**Learning:** Full-screen post-processing effects (like SSAO and Bloom) scale quadratically with resolution. Leaving the Device Pixel Ratio (DPR) uncapped on high-density displays (e.g. Retina displays at 2x or 3x) can lead to severe framerate degradation.
**Action:** Always cap the maximum Device Pixel Ratio in the `<Canvas>` component (e.g. `dpr={[1, 1.5]}`) when utilizing heavy post-processing effects to maintain a balance of visual fidelity and stable performance.

## 2026-04-07 - Replace SSAO with N8AO for superior performance
**Learning:** Using the legacy `<SSAO>` component from `@react-three/postprocessing` is inherently slow, and if a `<NormalPass>` is omitted from the `EffectComposer`, it incurs immense hidden overhead by forcing expensive on-the-fly depth-to-normal reconstruction for every fragment.
**Action:** Always replace `<SSAO>` with `<N8AO>` (N8 Ambient Occlusion) when using `@react-three/postprocessing`. N8AO is a highly optimized, modern implementation that provides much faster performance and better visual quality without requiring a separate normal pass. Set `quality="performance"` and `halfRes` for maximum framerates.

## 2026-04-08 - Avoid expensive CSS compositing over WebGL
**Learning:** Using CSS properties like `backdrop-filter: blur()` or `mix-blend-mode` on elements overlaying an active WebGL `<Canvas>` destroys performance. These properties force the browser to perform expensive per-frame read-backs of the canvas buffer for software compositing, bypassing hardware-accelerated direct scanout and often cutting framerates in half.
**Action:** Avoid complex CSS compositing effects over active WebGL scenes. Instead, use opaque or simple semi-transparent backgrounds (e.g., `bg-black/80`) and standard text contrast (e.g., `drop-shadow-lg`) to maintain 60fps.

## 2026-04-09 - Disable matrixAutoUpdate for static meshes
**Learning:** Three.js defaults to calculating the world matrix for every object on every frame if `matrixAutoUpdate` is true, which introduces unnecessary CPU overhead for objects that never move.
**Action:** Always add `matrixAutoUpdate={false}` and `onUpdate={(self) => self.updateMatrix()}` to static `<mesh>` components in React Three Fiber to skip useless matrix recalculations.

## 2026-04-14 - Skip redundant math in useFrame loops when idle
**Learning:** Continuous calculations like piecewise linear interpolations, matrix math, and quaternions inside `useFrame` will run 60 times a second even when the target state hasn't changed and the transition has completed, needlessly draining battery.
**Action:** Use refs to track the input state (like scroll offset) and check if the current value matches the target value (e.g., using `.distanceToSquared() < 0.001`). If both conditions are met, early return from the `useFrame` loop to skip unnecessary processing.

## 2024-05-18 - Preload critical 3D assets in Server Components
**Learning:** In Next.js applications using `next/dynamic` with `ssr: false` to load heavy React Three Fiber scenes, `useGLTF.preload` only executes after the client-side JavaScript bundle loads, creating a network waterfall and delaying the 3D scene's time-to-interactive.
**Action:** Always use `react-dom`'s `preload` function inside a Server Component (like `app/layout.tsx` or `app/page.tsx`) to eagerly fetch critical 3D assets (like .gltf, .hdr, or textures) concurrently with the initial HTML request.

## 2026-04-16 - Avoid redundant DOM manipulations in useFrame
**Learning:** Performing DOM property assignments (e.g., `element.style.transform = ...`) and allocating template strings continuously inside a `useFrame` hook generates unnecessary overhead when the corresponding values haven't changed (e.g., when the user is not actively scrolling). This wastes CPU cycles 60-120 times per second when idle.
**Action:** Use a `useRef` to track the last applied value and wrap DOM updates in a conditional check so they are only executed when the actual value changes.

## 2024-05-30 - Pre-calculate constant vectors instead of normalize() in shaders
**Learning:** In WebGL/Three.js fragment shaders, calling functions like `normalize()` on constant vectors forces the GPU to perform redundant calculations (e.g., inverse square roots) for every single pixel. This can cause significant overhead on high-resolution displays.
**Action:** Always pre-calculate constant vectors and use them directly (e.g., replace `normalize(vec3(1.0, 1.0, 1.0))` with `vec3(0.577350269)`) to optimize shader performance.

## 2026-04-18 - Offload perfectly linear shader math to vertexShader
**Learning:** Performing arithmetic combining constants, uniforms, and perfectly linear UVs (e.g. `uv.y * 20.0 - uTime * 5.0`) inside a WebGL `fragmentShader` forces the GPU to redundantly execute the same linear calculation for millions of pixels.
**Action:** Always offload perfectly linear mathematical combinations of uniforms and vertex attributes (like UVs or positions) to the `vertexShader`, store the result in a `varying` variable, and let the GPU's fixed-function rasterizer smoothly interpolate the result for the `fragmentShader`. This replaces millions of per-pixel arithmetic operations with thousands of per-vertex operations.

## 2024-06-25 - Preload @react-three/drei Environment HDRIs in Next.js Server Components
**Learning:** In Next.js applications using `next/dynamic` (`ssr: false`) to load React Three Fiber scenes, dynamic external assets like `@react-three/drei` Environment HDRIs cause network waterfalls because they only execute after the client bundle loads.
**Action:** Always use `react-dom`'s `preconnect()` and `preload()` functions inside a Server Component (like `layout.tsx`) to eagerly establish connections and fetch heavy external 3D assets (e.g. from raw.githubusercontent.com for PMNDRS assets) concurrently with the initial HTML request and JavaScript parsing.

## 2024-05-28 - Prefer hardware MSAA over SMAA post-processing
**Learning:** Using the `<SMAA />` post-processing pass introduces significant GPU overhead because it executes as an expensive full-screen fragment shader pass. In modern WebGL2 environments, hardware MSAA is generally much faster and integrated directly into the rasterization pipeline.
**Action:** Instead of adding `<SMAA />` to the `<EffectComposer>`, enable hardware multi-sampling by setting `multisampling={4}` (or 8) directly on the `<EffectComposer>` to leverage the native GPU anti-aliasing capabilities with significantly lower overhead.

## 2026-04-26 - Disable unused stencilBuffer in EffectComposer
**Learning:** By default, `@react-three/postprocessing`'s `EffectComposer` enables the stencil buffer. If a scene does not use stencil-based effects (like masks or certain outlines), this forces the GPU to needlessly allocate and manage an unused buffer, wasting VRAM and memory bandwidth.
**Action:** Always explicitly set `stencilBuffer={false}` on the `<EffectComposer>` when stencil effects are not in use to optimize GPU memory and bandwidth.
