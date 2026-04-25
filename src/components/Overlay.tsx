import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function Overlay() {
  const scroll = useScroll();
  const progressRef = useRef<HTMLDivElement>(null);
  const progressAriaRef = useRef<HTMLDivElement>(null);
  const lastOffset = useRef(-1);
  const lastPercentage = useRef(-1);

  useFrame(() => {
    if (progressRef.current && scroll) {
      // ⚡ Bolt: Only update DOM style if the scroll offset has actually changed.
      // This prevents useless string allocations and DOM property assignments 60-120 times per second when idle.
      if (scroll.offset !== lastOffset.current) {
        progressRef.current.style.transform = `scaleX(${scroll.offset})`;
        lastOffset.current = scroll.offset;

        if (progressAriaRef.current) {
          const percentage = Math.round(scroll.offset * 100);
          if (percentage !== lastPercentage.current) {
            progressAriaRef.current.setAttribute('aria-valuenow', percentage.toString());
            lastPercentage.current = percentage;
          }
        }
      }
    }
  });

  const handleScrollDown = () => {
    if (scroll && scroll.el) {
      // Respect user's reduced motion preference for JS-driven animations
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroll.el.scrollBy({
        top: window.innerHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      // Programmatically move focus to the next section's heading for keyboard/screen reader users
      // preventScroll: true is crucial here to not interrupt the smooth scroll animation
      const nextTitle = document.getElementById('flow-dynamics-title');
      if (nextTitle) {
        nextTitle.focus({ preventScroll: true });
      }
    }
  };

  const handleScrollToTop = () => {
    if (scroll && scroll.el) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scroll.el.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
      // Programmatically move focus back to the top element for keyboard/screen reader users
      // preventScroll: true is crucial here, otherwise the browser instantly snaps back to the top,
      // ruining the smooth scroll animation.
      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) {
        heroTitle.focus({ preventScroll: true });
      }
    }
  };

  return (
    <div className="w-screen">
      {/* Scroll Progress Bar */}
      <div
        ref={progressAriaRef}
        role="progressbar"
        aria-label="Scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="fixed top-0 left-0 w-full h-1.5 bg-white/10 z-50 pointer-events-none"
      >
        <div
          ref={progressRef}
          className="h-full bg-white origin-left"
          style={{ transform: 'scaleX(0)', willChange: 'transform' }} />
      </div>

      {/* Page 1 */}
      <section aria-labelledby="hero-title" className="relative h-screen flex flex-col justify-center items-start p-10 md:p-20">
        <h1 id="hero-title" tabIndex={-1} className="text-6xl md:text-9xl font-bold text-white tracking-tighter drop-shadow-lg focus:outline-none">VORTEX</h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-4 drop-shadow-lg">Interactive CFD Visualization</p>
        <button
          onClick={handleScrollDown}
          className="group absolute bottom-10 left-10 md:left-20 text-white/70 flex items-center gap-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg p-2 transition-all active:scale-95 pointer-events-auto"
        >
            <span className="sr-only">Scroll down, or use the down and up arrow keys to explore</span>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse motion-safe:group-hover:animate-bounce motion-safe:group-focus-visible:animate-bounce transition-transform"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg>
            <span aria-hidden="true">Scroll <span className="hidden md:inline">or use <kbd className="font-sans px-1 py-0.5 rounded-md bg-white/20 text-xs text-white">↓</kbd> <kbd className="font-sans px-1 py-0.5 rounded-md bg-white/20 text-xs text-white">↑</kbd> </span>to explore</span>
        </button>
      </section>

      {/* Page 2 */}
      <section aria-labelledby="flow-dynamics-title" className="h-screen flex flex-col justify-center items-end p-10 md:p-20 pointer-events-none">
        <div className="bg-black/80 p-8 rounded-lg max-w-md border border-white/10 pointer-events-auto hover:bg-black/90 transition-colors">
            <h2 id="flow-dynamics-title" tabIndex={-1} className="text-3xl md:text-4xl font-bold text-white mb-4 focus:outline-none">Flow Dynamics</h2>
            <p className="text-gray-200 leading-relaxed">
                Visualizing velocity magnitude around a cylindrical obstacle.
                Observe the laminar flow transition and the stagnation point where velocity drops to zero.
            </p>
        </div>
      </section>

      {/* Page 3 */}
      <section aria-labelledby="wake-analysis-title" className="h-screen flex flex-col justify-center items-start p-10 md:p-20 pointer-events-none">
         <div className="bg-black/80 p-8 rounded-lg max-w-md border border-white/10 pointer-events-auto hover:bg-black/90 transition-colors">
            <h2 id="wake-analysis-title" className="text-3xl md:text-4xl font-bold text-white mb-4">Wake Analysis</h2>
            <p className="text-gray-200 leading-relaxed">
                Detailed view of the wake region.
                Streamlines illustrate the complex flow patterns and potential vortex shedding downstream of the obstacle.
            </p>
        </div>
      </section>

      {/* Page 4 */}
      <section aria-labelledby="explore-data-title" className="h-screen flex flex-col justify-center items-center p-10 md:p-20">
        <h2 id="explore-data-title" className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">Explore the Data</h2>
        <div className="flex flex-col items-center gap-6">
          <a href="https://github.com/pyvista/pyvista" target="_blank" rel="noopener noreferrer" className="group px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all active:scale-95 pointer-events-auto inline-flex items-center gap-2 justify-center">
              Powered by PyVista & R3F
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link group-hover:-translate-y-1 group-focus-visible:-translate-y-1 group-hover:translate-x-1 group-focus-visible:translate-x-1 transition-transform" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
              <span className="sr-only"> (opens in a new tab)</span>
          </a>

          <button
            onClick={handleScrollToTop}
            className="group text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2 px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all active:scale-95 pointer-events-auto"
          >
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 group-focus-visible:-translate-y-1 transition-transform"><path d="m18 15-6-6-6 6" /></svg>
            <span className="font-medium">Back to Start</span>
          </button>
        </div>
      </section>
    </div>
  );
}
