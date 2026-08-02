import { useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';

export default function Overlay() {
  const scroll = useScroll();
  const progressRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const lastOffset = useRef(-1);
  const lastPercent = useRef(-1);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useFrame(() => {
    if (scroll) {
      // ⚡ Bolt: Only update DOM style if the scroll offset has actually changed.
      // This prevents useless string allocations and DOM property assignments 60-120 times per second when idle.
      if (scroll.offset !== lastOffset.current) {
        if (progressRef.current) {
            progressRef.current.style.transform = `translateX(${(scroll.offset - 1) * 100}%)`;
        }

        // 🎨 Palette: Throttle aria-valuenow updates to integer percentage changes
        // This prevents overwhelming screen readers with 60+ updates per second.
        const percent = Math.round(scroll.offset * 100);
        if (percent !== lastPercent.current && progressContainerRef.current) {
            progressContainerRef.current.setAttribute('aria-valuenow', percent.toString());
            lastPercent.current = percent;
        }

        lastOffset.current = scroll.offset;
      }
    }
  });

  const scrollToPage = (pageIndex: number, targetId: string) => {
    if (scroll && scroll.el) {
      // Respect user's reduced motion preference for JS-driven animations
      // ⚡ Bolt: Use cached ref instead of querying window.matchMedia synchronously
      scroll.el.scrollTo({
        top: window.innerHeight * pageIndex,
        behavior: prefersReducedMotion.current ? 'auto' : 'smooth'
      });

      // Programmatically move focus to the next section's heading for keyboard/screen reader users
      // preventScroll: true is crucial here to not interrupt the smooth scroll animation
      const nextTitle = document.getElementById(targetId);
      if (nextTitle) {
        nextTitle.focus({ preventScroll: true });
      }
    }
  };

  const handleScrollToTop = () => {
    if (scroll && scroll.el) {
      // ⚡ Bolt: Use cached ref instead of querying window.matchMedia synchronously
      scroll.el.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.current ? 'auto' : 'smooth'
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
      {/* Skip to Content Link for Keyboard Users */}
      <button
        onClick={() => scrollToPage(3, 'explore-data-title')}
        aria-keyshortcuts="End"
        className="group sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-6 focus-visible:left-6 focus-visible:z-[100] focus-visible:px-6 focus-visible:py-3 focus-visible:bg-white focus-visible:text-black focus-visible:rounded-full focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black pointer-events-auto flex items-center gap-2"
      >
        <span className="font-medium flex items-center gap-2">
          Skip to Explore Data<span className="sr-only"> (Keyboard shortcut: End)</span>
          <kbd aria-hidden="true" className="font-sans px-2 py-0.5 rounded-md bg-black/10 border border-black/30 border-b-[3px] shadow-sm text-xs text-black font-bold transition-colors group-hover:bg-black/20 group-focus-visible:bg-black/20 group-active:border-b group-active:translate-y-[2px]">End</kbd>
        </span>
      </button>

      {/* Scroll Progress Bar */}
      <div
        ref={progressContainerRef}
        role="progressbar"
        aria-label="Scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        className="fixed top-0 left-0 w-full h-1.5 bg-white/10 z-50 pointer-events-none overflow-hidden"
      >
        <div
          ref={progressRef}
          className="h-full w-full bg-white rounded-r-full"
          style={{ transform: 'translateX(-100%)', willChange: 'transform' }} />
      </div>

      {/* Page 1 */}
      <section aria-labelledby="hero-title" className="relative h-screen flex flex-col justify-center items-start p-10 md:p-20">
        <h1 id="hero-title" tabIndex={-1} className="text-6xl md:text-9xl font-bold text-white tracking-tighter drop-shadow-lg focus:outline-none">VORTEX</h1>
        <p className="text-xl md:text-2xl text-gray-300 mt-4 drop-shadow-lg">Interactive <abbr tabIndex={0} title="Computational Fluid Dynamics" className="cursor-help underline decoration-white/50 decoration-dotted underline-offset-4 hover:bg-white/10 focus-visible:outline-none focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-white rounded-sm px-1 transition-colors">CFD</abbr> Visualization</p>
        <button
          onClick={() => scrollToPage(1, 'flow-dynamics-title')}
          aria-keyshortcuts="ArrowDown ArrowUp"
          className="group absolute bottom-10 left-10 md:left-20 text-white/70 flex items-center gap-2 hover:text-white hover:bg-white/10 focus-visible:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg p-2 transition-all active:scale-95 pointer-events-auto"
        >
            <span className="sr-only">Scroll down, or use the down and up arrow keys to explore</span>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mouse motion-safe:group-hover:animate-bounce motion-safe:group-focus-visible:animate-bounce transition-transform"><rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/></svg>
            <span aria-hidden="true">Scroll <span className="hidden md:inline">or use <kbd className="font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold mx-0.5 inline-block transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">↓</kbd> <kbd className="font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold mx-0.5 inline-block transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">↑</kbd> </span>to explore</span>
        </button>
      </section>

      {/* Page 2 */}
      <section aria-labelledby="flow-dynamics-title" className="h-screen flex flex-col justify-center items-end p-10 md:p-20 pointer-events-none">
        {/* ⚡ Bolt: Removed backdrop-blur-md and changed bg to black/80.
            Using CSS properties like backdrop-filter over an active WebGL Canvas
            forces the browser into expensive software compositing, severely degrading performance. */}
        <div className="bg-black/80 drop-shadow-lg p-8 rounded-lg max-w-md border border-white/10 pointer-events-auto flex flex-col gap-6">
            <div>
              <h2 id="flow-dynamics-title" tabIndex={-1} className="text-3xl md:text-4xl font-bold text-white mb-4 focus:outline-none">Flow Dynamics</h2>
              <p className="text-gray-200 leading-relaxed">
                  Visualizing velocity magnitude around a cylindrical obstacle.
                  Observe the laminar flow transition and the stagnation point where velocity drops to zero.
              </p>
            </div>
            <button
              onClick={() => scrollToPage(2, 'wake-analysis-title')}
              aria-keyshortcuts="ArrowDown ArrowUp"
              className="group self-start text-white/70 flex items-center gap-2 hover:text-white hover:bg-white/10 focus-visible:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg p-2 -ml-2 transition-all active:scale-95"
            >
              <span className="font-medium text-sm flex items-center gap-2">
                Continue to Wake Analysis<span className="sr-only"> (Keyboard shortcuts: Down and Up arrows)</span>
                <span aria-hidden="true" className="hidden md:inline-flex gap-1">
                  <kbd className="font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">↓</kbd>
                  <kbd className="font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">↑</kbd>
                </span>
              </span>
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 group-focus-visible:translate-y-1 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
            </button>
        </div>
      </section>

      {/* Page 3 */}
      <section aria-labelledby="wake-analysis-title" className="h-screen flex flex-col justify-center items-start p-10 md:p-20 pointer-events-none">
         {/* ⚡ Bolt: Removed backdrop-blur-md and changed bg to black/80.
             Using CSS properties like backdrop-filter over an active WebGL Canvas
             forces the browser into expensive software compositing, severely degrading performance. */}
         <div className="bg-black/80 drop-shadow-lg p-8 rounded-lg max-w-md border border-white/10 pointer-events-auto flex flex-col gap-6">
            <div>
              <h2 id="wake-analysis-title" tabIndex={-1} className="text-3xl md:text-4xl font-bold text-white mb-4 focus:outline-none">Wake Analysis</h2>
              <p className="text-gray-200 leading-relaxed">
                  Detailed view of the wake region.
                  Streamlines illustrate the complex flow patterns and potential vortex shedding downstream of the obstacle.
              </p>
            </div>
            <button
              onClick={() => scrollToPage(3, 'explore-data-title')}
              aria-keyshortcuts="ArrowDown ArrowUp"
              className="group self-start text-white/70 flex items-center gap-2 hover:text-white hover:bg-white/10 focus-visible:text-white focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg p-2 -ml-2 transition-all active:scale-95"
            >
              <span className="font-medium text-sm flex items-center gap-2">
                Continue to Explore Data<span className="sr-only"> (Keyboard shortcuts: Down and Up arrows)</span>
                <span aria-hidden="true" className="hidden md:inline-flex gap-1">
                  <kbd className="font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">↓</kbd>
                  <kbd className="font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">↑</kbd>
                </span>
              </span>
              <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 group-focus-visible:translate-y-1 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
            </button>
        </div>
      </section>

      {/* Page 4 */}
      <section aria-labelledby="explore-data-title" className="h-screen flex flex-col justify-center items-center p-10 md:p-20">
        <h2 id="explore-data-title" tabIndex={-1} className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg focus:outline-none">Explore the Data</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="group relative px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 focus-within:bg-gray-200 transition-all active:scale-95 pointer-events-auto inline-flex items-center gap-2 justify-center">
              <a href="https://github.com/pyvista/pyvista" target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="peer after:absolute after:inset-0 focus:outline-none inline-flex items-center gap-2">
                Powered by PyVista <span aria-hidden="true">&</span>
                <span className="sr-only"> and R3F (opens in a new tab)</span>
              </a>
              <span aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none peer-focus-visible:ring-2 peer-focus-visible:ring-white peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-black"></span>
              <abbr tabIndex={0} title="React Three Fiber" className="relative z-10 cursor-help underline decoration-black/50 decoration-dotted underline-offset-4 hover:bg-black/10 focus-visible:outline-none focus-visible:bg-black/10 focus-visible:ring-2 focus-visible:ring-black rounded-sm px-1 transition-colors">R3F</abbr>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link group-hover:-translate-y-1 group-focus-within:-translate-y-1 group-hover:translate-x-1 group-focus-within:translate-x-1 transition-transform relative z-10 pointer-events-none" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
          </div>

          <button
            onClick={handleScrollToTop}
            aria-keyshortcuts="Home"
            className="group text-white/70 hover:text-white hover:bg-white/10 focus-visible:text-white focus-visible:bg-white/10 flex items-center gap-2 px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all active:scale-95 pointer-events-auto"
          >
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 group-focus-visible:-translate-y-1 transition-transform"><path d="m18 15-6-6-6 6" /></svg>
            <span className="font-medium flex items-center gap-2">
              Back to Start<span className="sr-only"> (Keyboard shortcut: Home)</span>
              <kbd aria-hidden="true" className="hidden md:inline-block font-sans px-2 py-0.5 rounded-md bg-white/10 border border-white/30 border-b-[3px] shadow-sm text-xs text-white font-bold transition-colors group-hover:bg-white/20 group-focus-visible:bg-white/20 group-active:border-b group-active:translate-y-[2px]">Home</kbd>
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
