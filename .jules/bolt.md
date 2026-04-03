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

## 2025-06-15 - Cap DPR for Heavy Post-Processing
**Learning:** React Three Fiber's `dpr={[1, 2]}` allows pixel ratios up to 2. On Retina displays, this forces the GPU to render 4x the pixels. Since full-screen post-processing effects (like SSAO and Bloom) scale quadratically with resolution, this causes severe framerate degradation.
**Action:** Always cap `dpr` to a maximum of 1.5 (e.g., `dpr={[1, 1.5]}`) or 1 when utilizing expensive full-screen post-processing passes to maintain 60 FPS without noticeable loss in visual quality.
