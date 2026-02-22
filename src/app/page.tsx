import Scene from "@/components/Scene";

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Scene />
      </div>
    </main>
  );
}
