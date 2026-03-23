## 2024-03-23 - Prevent memory leaks in useFrame loop
**Learning:** Three.js object instantiation inside `useFrame` can cause significant Garbage Collection pauses, especially when using things like `new THREE.Vector3()` or `.clone()` on every frame.
**Action:** Always pre-allocate Three.js objects outside of the render loop (module scope) and reuse them using methods like `.copy()`, `.lerpVectors()`, or `.slerp()`.
