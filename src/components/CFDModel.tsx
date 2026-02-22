'use client';

import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Sample the base color (velocity magnitude)
  vec4 baseColor = texture2D(uTexture, vUv);

  // Create a flow effect
  // Assuming vUv.x is along the tube length or vUv.y
  // We'll try both or a combination.
  // Usually for tubes: x is around, y is along.

  float flow = sin(vUv.y * 20.0 - uTime * 5.0);
  float flowPattern = smoothstep(0.4, 0.6, flow);

  // Add a glowing pulse
  float pulse = exp(-mod(vUv.y * 10.0 - uTime * 2.0, 5.0));

  // Mix
  vec3 color = baseColor.rgb;
  color += vec3(0.2, 0.4, 1.0) * flowPattern * 0.3;
  color += vec3(1.0) * pulse * 0.5;

  // Simple lighting
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diff = max(dot(vNormal, lightDir), 0.0);
  color *= (0.5 + 0.5 * diff);

  gl_FragColor = vec4(color, 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export default function CFDModel() {
  const { nodes: streamNodes } = useGLTF('/assets/streamlines.gltf') as any;
  const { nodes: cylNodes } = useGLTF('/assets/cylinder.gltf') as any;

  // Extract meshes
  const streamMesh = Object.values(streamNodes).find((n: any) => n.isMesh) as THREE.Mesh;
  const cylMesh = Object.values(cylNodes).find((n: any) => n.isMesh) as THREE.Mesh;

  // Prepare Shader Material
  const material = useMemo(() => {
    if (!streamMesh) return null;

    // Get the existing texture map
    const originalMaterial = streamMesh.material as THREE.MeshStandardMaterial;
    const map = originalMaterial.map || null;

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: map }
      },
      side: THREE.DoubleSide
    });
  }, [streamMesh]);

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group>
      {streamMesh && material && (
        <mesh
          geometry={streamMesh.geometry}
          material={material}
          rotation={streamMesh.rotation}
          position={streamMesh.position}
          scale={streamMesh.scale}
        />
      )}
      {cylMesh && (
        <mesh
          geometry={cylMesh.geometry}
          rotation={cylMesh.rotation}
          position={cylMesh.position}
          scale={cylMesh.scale}
        >
           <meshStandardMaterial color="#888888" roughness={0.4} metalness={0.8} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload('/assets/streamlines.gltf');
useGLTF.preload('/assets/cylinder.gltf');
