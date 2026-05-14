'use client';

import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vUv;
varying float vLight;
varying float vFlowPhase;
varying float vPulsePhase;

void main() {
  // Sample the base color (velocity magnitude)
  vec4 baseColor = texture2D(uTexture, vUv);

  // Create a flow effect
  // ⚡ Bolt: Flow and pulse phases are now computed in the vertex shader and interpolated,
  // drastically reducing per-fragment arithmetic operations.
  float flow = sin(vFlowPhase);
  float flowPattern = smoothstep(0.4, 0.6, flow);

  // Add a glowing pulse
  // ⚡ Bolt: Use fract() instead of mod() for better performance on many GPUs.
  // ⚡ Bolt: vPulsePhase is pre-scaled in the vertex shader to avoid the * 0.2 multiplication here.
  float pulse = exp(-(fract(vPulsePhase) * 5.0));

  // Mix
  vec3 color = baseColor.rgb;
  // ⚡ Bolt: Pre-calculate constant vector math: vec3(0.2, 0.4, 1.0) * 0.3 = vec3(0.06, 0.12, 0.3)
  color += vec3(0.06, 0.12, 0.3) * flowPattern;
  // ⚡ Bolt: Simplify vec3(1.0) * pulse * 0.5 to vec3(pulse * 0.5)
  color += vec3(pulse * 0.5);

  // Simple lighting
  // ⚡ Bolt: The final lighting multiplier (0.5 + 0.5 * vDiff) is now pre-computed
  // in the vertex shader and passed as vLight, saving per-pixel additions and multiplications.
  color *= vLight;

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying float vLight;
varying float vFlowPhase;
varying float vPulsePhase;

void main() {
  vUv = uv;
  vec3 normalWorld = normalize(normalMatrix * normal);

  // ⚡ Bolt: Offload the vector dot product to the vertex shader.
  // We compute the diffuse lighting term here instead of per-pixel.
  const vec3 lightDir = vec3(0.577350269);
  float vDiff = max(dot(normalWorld, lightDir), 0.0);
  // ⚡ Bolt: Compute final lighting multiplier in vertex shader as it is perfectly linear
  vLight = 0.5 + 0.5 * vDiff;

  // ⚡ Bolt: Offload linear phase math to the vertex shader.
  // These perfectly linear combinations of uv and uTime are interpolated smoothly
  // across the primitive, replacing millions of fragment calculations with thousands of vertex calculations.
  vFlowPhase = uv.y * 20.0 - uTime * 5.0;
  // ⚡ Bolt: Pre-scale pulse phase by 0.2 here so we don't have to multiply per-fragment later
  vPulsePhase = uv.y * 2.0 - uTime * 0.4;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function CFDModel() {
  const { nodes: streamNodes } = useGLTF('/assets/streamlines.gltf') as unknown as { nodes: Record<string, THREE.Object3D> };
  const { nodes: cylNodes } = useGLTF('/assets/cylinder.gltf') as unknown as { nodes: Record<string, THREE.Object3D> };

  // ⚡ Bolt: Memoize mesh extraction to prevent O(n) array allocations and searches on every render.
  const streamMesh = useMemo(
    () => Object.values(streamNodes).find((n) => (n as THREE.Mesh).isMesh) as THREE.Mesh,
    [streamNodes]
  );

  const cylMesh = useMemo(
    () => Object.values(cylNodes).find((n) => (n as THREE.Mesh).isMesh) as THREE.Mesh,
    [cylNodes]
  );

  // ⚡ Bolt: Memoize uniforms and use <shaderMaterial> JSX instead of new THREE.ShaderMaterial()
  // This allows R3F to automatically dispose of the material on unmount, preventing GPU memory leaks,
  // and removes the need for manual ref synchronization during the render phase.
  const uniforms = useMemo(() => {
    const originalMaterial = streamMesh?.material as THREE.MeshStandardMaterial | undefined;
    return {
      uTime: { value: 0 },
      uTexture: { value: originalMaterial?.map || null }
    };
  }, [streamMesh]);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {streamMesh && (
        <mesh
          geometry={streamMesh.geometry}
          rotation={streamMesh.rotation}
          position={streamMesh.position}
          scale={streamMesh.scale}
          matrixAutoUpdate={false}
          // ⚡ Bolt: Disable frustum culling for these static, always-visible meshes.
          // This skips expensive bounding box intersection checks against the camera frustum every frame.
          frustumCulled={false}
          onUpdate={(self) => self.updateMatrix()}
        >
          <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>
      )}
      {cylMesh && (
        <mesh
          geometry={cylMesh.geometry}
          rotation={cylMesh.rotation}
          position={cylMesh.position}
          scale={cylMesh.scale}
          matrixAutoUpdate={false}
          // ⚡ Bolt: Disable frustum culling for these static, always-visible meshes.
          // This skips expensive bounding box intersection checks against the camera frustum every frame.
          frustumCulled={false}
          onUpdate={(self) => self.updateMatrix()}
        >
           <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload('/assets/streamlines.gltf');
useGLTF.preload('/assets/cylinder.gltf');
