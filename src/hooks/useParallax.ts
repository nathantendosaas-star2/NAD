import { useEffect } from 'react';

interface ParallaxOptions {
  maxTravel?: number;
  intensity?: number;
  scale?: number;
}

export function useParallax(options: ParallaxOptions = {}) {
  const { maxTravel = 45, intensity = 1.0, scale = 1.08 } = options;

  useEffect(() => {
    // Respect user's reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let frameId: number | null = null;
    let mouseX = 0;
    let mouseY = 0;

    const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

    const handleMouseMove = (e: MouseEvent) => {
      // Subtle mouse coordinate tilt for desktop only
      if (window.innerWidth > 768) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 8;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 8;
      }
    };

    const updateParallax = () => {
      frameId = null;
      const viewportHeight = window.innerHeight;
      const scenes = document.querySelectorAll<HTMLElement>('[data-parallax-scene]');

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();

        // Only calculate for visible sections in the viewport
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const layers = scene.querySelectorAll<HTMLElement>('[data-depth]');
        // Fluid viewport progress calculation from bottom entering (0) to top exiting (1)
        const totalDistance = viewportHeight + rect.height;
        const progress = clamp((viewportHeight - rect.top) / totalDistance, 0, 1);

        layers.forEach((layer) => {
          const depth = clamp(parseFloat(layer.dataset.depth || '0'), -1.5, 1.5);
          const offsetY = (progress - 0.5) * 2 * depth * maxTravel * intensity;
          const tiltX = 0; // Removed horizontal motion as per user request
          const tiltY = depth * mouseY * 0.3;

          layer.style.transform = `translate3d(${tiltX.toFixed(2)}px, ${(offsetY + tiltY).toFixed(2)}px, 0) scale(${scale})`;
        });
      });
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    window.addEventListener('mousemove', scheduleUpdate, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Initial render
    updateParallax();

    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('mousemove', scheduleUpdate);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [maxTravel, intensity, scale]);
}
