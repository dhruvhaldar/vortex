'use client';

import dynamic from "next/dynamic";

// ⚡ Bolt: Dynamically import the heavy Scene component to split out Three.js/R3F/Drei from the initial bundle.
// Disable SSR since Canvas cannot be rendered on the server anyway.
const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />
});

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Scene />
      </div>
    </main>
  );
}
