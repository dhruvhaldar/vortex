'use client';

import { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Define waypoints outside component
const p1 = new THREE.Vector3(8, 5, 8); // Start: Overview
const t1 = new THREE.Vector3(0, 0, 0);

const p2 = new THREE.Vector3(2, 0.5, 5); // Close up side
const t2 = new THREE.Vector3(0, 0, 1);

const p3 = new THREE.Vector3(-4, 2, 6); // Wake view
const t3 = new THREE.Vector3(0, 0, 2);

const p4 = new THREE.Vector3(-8, 8, 0); // Top/Rear overview
const t4 = new THREE.Vector3(0, 0, 0);

// Pre-allocate objects to avoid garbage collection pauses in useFrame
const currentPos = new THREE.Vector3();
const currentTarget = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();
const lookAtMatrix = new THREE.Matrix4();

export default function CameraHandler() {
  const scroll = useScroll();
  const lastOffset = useRef(-1);

  useFrame((state, delta) => {
    const offset = scroll.offset; // 0..1

    let changed = false;
    // ⚡ Bolt: Only recalculate waypoints if offset has changed
    if (offset !== lastOffset.current) {
        lastOffset.current = offset;
        changed = true;
        // Piecewise linear interpolation between waypoints
        if (offset < 0.33) {
            const t = offset / 0.33;
            currentPos.lerpVectors(p1, p2, t);
            currentTarget.lerpVectors(t1, t2, t);
        } else if (offset < 0.66) {
            const t = (offset - 0.33) / 0.33;
            currentPos.lerpVectors(p2, p3, t);
            currentTarget.lerpVectors(t2, t3, t);
        } else {
            // Ensure t goes from 0 to 1 in the last segment
            const t = (offset - 0.66) / 0.34;
            currentPos.lerpVectors(p3, p4, Math.min(t, 1));
            currentTarget.lerpVectors(t3, t4, Math.min(t, 1));
        }
    }

    // ⚡ Bolt: Add early return to skip unnecessary processing when idle.
    // If the scroll hasn't changed and the camera has roughly reached its target position,
    // skip the expensive matrix math and interpolation.
    if (!changed && state.camera.position.distanceToSquared(currentPos) < 0.001) {
        return;
    }

    // Smooth camera movement
    // Lerp towards the target position for cinematic feel
    state.camera.position.lerp(currentPos, 3.0 * delta);

    // Smooth lookAt
    // ⚡ Bolt: Use Matrix4.lookAt to compute target rotation instead of camera.lookAt()
    // This avoids triggering expensive updateWorldMatrix() calls on the camera every frame
    // and removes the need for multiple quaternion copy operations.
    lookAtMatrix.lookAt(state.camera.position, currentTarget, state.camera.up);
    targetQuaternion.setFromRotationMatrix(lookAtMatrix);

    state.camera.quaternion.slerp(targetQuaternion, 3.0 * delta);
  });

  return null;
}
