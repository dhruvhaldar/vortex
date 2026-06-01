'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ScrollControls, Scroll, Environment, Loader, useEnvironment } from '@react-three/drei';
import { EffectComposer, Bloom, N8AO } from '@react-three/postprocessing';
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
        // ⚡ Bolt: Cap the max Device Pixel Ratio to 1.5. Full-screen post-processing effects (SSAO, Bloom)
        // scale quadratically with resolution, causing severe framerate drops on high-density displays (e.g. 2x or 3x Retina)
        // if left uncapped. 1.5 offers a good balance of visual quality and performance.
        dpr={[1, 1.5]}
        // ⚡ Bolt: Explicitly request the high-performance discrete GPU.
        // On dual-GPU systems (like many laptops), browsers may default to the integrated low-power GPU.
        // This scene is heavy with post-processing (SSAO, Bloom), so forcing the discrete GPU drastically improves framerates.
        gl={{ antialias: false, stencil: false, alpha: false, powerPreference: "high-performance" }}
        // ⚡ Bolt: Disable pointer events on the Canvas. Since this scene has no interactive 3D objects, this prevents R3F from running expensive raycasting computations on every mouse move, saving CPU.
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.5} />
        {/* ⚡ Bolt: Replaced pointLight with directionalLight. Point lights calculate distance and attenuation per-pixel,
            which is computationally expensive. For broad illumination, directional lights are significantly faster
            because the light vector is constant. */}
        <directionalLight position={[10, 10, 10]} intensity={1.0} />

        <Suspense fallback={null}>
            <ScrollControls pages={4} damping={0.2}>
                <CameraHandler />
                <CFDModel />
                <Environment files="/assets/potsdamer_platz_1k.hdr" />
                <Scroll html>
                    <Overlay />
                </Scroll>
            </ScrollControls>

            {/* ⚡ Bolt: Replaced SMAA with hardware MSAA. SMAA runs as an expensive full-screen fragment shader pass.
                In WebGL2, hardware MSAA (multisampling={4}) is generally much faster and integrated into the rasterization pipeline,
                significantly reducing GPU overhead. */}
            {/* ⚡ Bolt: Explicitly disable the stencil buffer in the EffectComposer.
                Since we are not using any stencil-based effects (like masks or outlines),
                disabling it prevents the GPU from allocating and managing an unused stencil buffer,
                saving VRAM and memory bandwidth. */}
            <EffectComposer multisampling={4} stencilBuffer={false}>
                {/* ⚡ Bolt: Replaced legacy SSAO with N8AO (N8 Ambient Occlusion).
                    N8AO is highly optimized, significantly faster, and doesn't require a separate NormalPass
                    which was missing and causing expensive on-the-fly depth-to-normal reconstruction. */}
                <N8AO
                    aoRadius={0.4}
                    intensity={5}
                    quality="performance"
                    halfRes
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
// ⚡ Bolt: Preload the Environment HDRI concurrently with the JS module evaluation.
// If left un-preloaded, React Suspense would halt rendering at `<CFDModel />`, preventing `<Environment />`
// from mounting and parsing its heavy HDR asset until AFTER the GLTFs finish, causing a CPU parsing waterfall.
useEnvironment.preload({ files: '/assets/potsdamer_platz_1k.hdr' });
