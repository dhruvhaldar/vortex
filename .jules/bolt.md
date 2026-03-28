## 2024-03-23 - Prevent memory leaks in useFrame loop
**Learning:** Three.js object instantiation inside `useFrame` can cause significant Garbage Collection pauses, especially when using things like `new THREE.Vector3()` or `.clone()` on every frame.
**Action:** Always pre-allocate Three.js objects outside of the render loop (module scope) and reuse them using methods like `.copy()`, `.lerpVectors()`, or `.slerp()`.

## 2024-05-24 - Avoid DoubleSide on closed geometry
**Learning:** Using `side: THREE.DoubleSide` on closed geometry like generated tubes disables backface culling, effectively doubling the fragment shader workload without any visual benefit.
**Action:** Default to `THREE.FrontSide` for all closed geometries, and only enable `DoubleSide` when explicitly rendering open surfaces (like planes or unclosed shells).

## 2024-11-20 - Avoid Object3D.lookAt in render loop
**Learning:** Calling `Object3D.lookAt()` (including `Camera.lookAt()`) internally calls `updateWorldMatrix(true, false)`. Doing this inside `useFrame` forces expensive, synchronous matrix recalculations on the object and its ancestors every frame, bypassing Three.js's optimized rendering phase updates.
**Action:** When computing rotations dynamically (like smooth camera tracking), construct a rotation matrix directly via `new THREE.Matrix4().lookAt(eye, target, up)` and extract the quaternion with `setFromRotationMatrix()`. This avoids both matrix overhead and unnecessary quaternion copying.
