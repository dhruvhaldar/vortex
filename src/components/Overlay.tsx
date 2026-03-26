export default function Overlay() {
  return (
    <div className="w-screen">
      {/* Page 1 */}
      <section aria-labelledby="hero-title" className="h-screen flex flex-col justify-center items-start p-10 md:p-20">
        <h1 id="hero-title" className="text-6xl md:text-9xl font-bold text-white tracking-tighter mix-blend-difference">VORTEX</h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-4 mix-blend-difference">Interactive CFD Visualization</p>
        <div className="absolute bottom-10 left-10 md:left-20 animate-bounce text-white/70 flex items-center gap-2" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg>
            Scroll to explore
        </div>
      </section>

      {/* Page 2 */}
      <section aria-labelledby="flow-dynamics-title" className="h-screen flex flex-col justify-center items-end p-10 md:p-20 pointer-events-none">
        <div className="bg-black/30 p-8 rounded-lg backdrop-blur-md max-w-md border border-white/10 pointer-events-auto hover:bg-black/50 transition-colors">
            <h2 id="flow-dynamics-title" className="text-3xl md:text-4xl font-bold text-white mb-4">Flow Dynamics</h2>
            <p className="text-gray-200 leading-relaxed">
                Visualizing velocity magnitude around a cylindrical obstacle.
                Observe the laminar flow transition and the stagnation point where velocity drops to zero.
            </p>
        </div>
      </section>

      {/* Page 3 */}
      <section aria-labelledby="wake-analysis-title" className="h-screen flex flex-col justify-center items-start p-10 md:p-20 pointer-events-none">
         <div className="bg-black/30 p-8 rounded-lg backdrop-blur-md max-w-md border border-white/10 pointer-events-auto hover:bg-black/50 transition-colors">
            <h2 id="wake-analysis-title" className="text-3xl md:text-4xl font-bold text-white mb-4">Wake Analysis</h2>
            <p className="text-gray-200 leading-relaxed">
                Detailed view of the wake region.
                Streamlines illustrate the complex flow patterns and potential vortex shedding downstream of the obstacle.
            </p>
        </div>
      </section>

      {/* Page 4 */}
      <section aria-labelledby="explore-data-title" className="h-screen flex flex-col justify-center items-center p-10 md:p-20">
        <h2 id="explore-data-title" className="text-4xl md:text-6xl font-bold text-white mb-8 mix-blend-difference">Explore the Data</h2>
        <a href="https://github.com/pyvista/pyvista" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40 transition-colors pointer-events-auto">
            Powered by PyVista & R3F
            <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </section>
    </div>
  );
}
