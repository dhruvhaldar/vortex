'use client';

import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vNormal;
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
  float pulse = exp(-mod(vPulsePhase, 5.0));

  // Mix
  vec3 color = baseColor.rgb;
  color += vec3(0.2, 0.4, 1.0) * flowPattern * 0.3;
  color += vec3(1.0) * pulse * 0.5;

  // Simple lighting
  // ⚡ Bolt: Avoid calling normalize() on constant vectors inside the fragment shader.
  // Pre-calculating the normalized vector (1.0 / sqrt(3) ≈ 0.577350269) saves expensive
  // inverse square root calculations for every single pixel.
  const vec3 lightDir = vec3(0.577350269);
  float diff = max(dot(vNormal, lightDir), 0.0);
  color *= (0.5 + 0.5 * diff);

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying float vFlowPhase;
varying float vPulsePhase;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  // ⚡ Bolt: Offload linear phase math to the vertex shader.
  // These perfectly linear combinations of uv and uTime are interpolated smoothly
  // across the primitive, replacing millions of fragment calculations with thousands of vertex calculations.
  vFlowPhase = uv.y * 20.0 - uTime * 5.0;
  vPulsePhase = uv.y * 10.0 - uTime * 2.0;

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
