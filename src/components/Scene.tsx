'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ScrollControls, Scroll, Environment, Loader } from '@react-three/drei';
import { EffectComposer, Bloom, SSAO, SMAA } from '@react-three/postprocessing';
import CFDModel from './CFDModel';
import CameraHandler from './CameraHandler';
import Overlay from './Overlay';

export default function Scene() {
  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-black">
      <Canvas
        aria-label="Interactive 3D fluid dynamics visualization"
        role="img"
        camera={{ position: [5, 5, 5], fov: 45 }}
        dpr={[1, 2]}
        // ⚡ Bolt: Explicitly request the high-performance discrete GPU.
        // On dual-GPU systems (like many laptops), browsers may default to the integrated low-power GPU.
        // This scene is heavy with post-processing (SSAO, Bloom), so forcing the discrete GPU drastically improves framerates.
        gl={{ antialias: false, stencil: false, alpha: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.0} />

        <Suspense fallback={null}>
            <ScrollControls pages={4} damping={0.2}>
                <CameraHandler />
                <CFDModel />
                <Environment preset="city" />
                <Scroll html>
                    <Overlay />
                </Scroll>
            </ScrollControls>

            <EffectComposer multisampling={0}>
                <SMAA />
                <SSAO
                    radius={0.4}
                    intensity={5}
                    luminanceInfluence={0.4}
                />
                <Bloom
                    luminanceThreshold={0.2}
                    mipmapBlur
                    intensity={0.5}
                    radius={0.5}
                />
            </EffectComposer>
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
