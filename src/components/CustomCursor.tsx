import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check if hovering an element with cursor directives
      const target = e.target as HTMLElement | null;
      const closestPreview = target?.closest('[data-preview-img]') as HTMLElement | null;
      const closestCursor = target?.closest('[data-cursor]') as HTMLElement | null;
      const closestInteractive = target?.closest('button, a, select, input, [role="button"]') as HTMLElement | null;

      if (closestPreview) {
        setPreviewImage(closestPreview.getAttribute('data-preview-img'));
        setCursorText(closestPreview.getAttribute('data-cursor-text') || 'VIEW');
        setIsHovered(true);
      } else if (closestCursor) {
        setPreviewImage(null);
        setCursorText(closestCursor.getAttribute('data-cursor'));
        setIsHovered(true);
      } else if (closestInteractive) {
        setPreviewImage(null);
        setCursorText(null);
        setIsHovered(true);
      } else {
        setPreviewImage(null);
        setCursorText(null);
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    let animationFrameId: number;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const animateCursor = () => {
      posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.15);
      posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.15);
      setPosition({ x: posRef.current.x, y: posRef.current.y });
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouch || !isVisible) return null;

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Floating Image Preview Portal Mode */}
      {previewImage ? (
        <div className="relative w-36 h-48 bg-[#FFFFFF] border border-[#C9473B] shadow-2xl rounded-2xl overflow-hidden p-1 animate-in zoom-in-75 duration-200">
          <img
            src={previewImage}
            alt=""
            className="w-full h-full object-cover rounded-xl"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5 rounded-2xl">
            <span className="font-serif-heavy text-[10px] tracking-widest text-[#FFFFFF] uppercase">
              {cursorText || 'INSPECT'}
            </span>
          </div>
          {/* Technical Crosshairs */}
          <span className="absolute top-2 left-2 text-[8px] font-mono text-[#C9473B] leading-none">+</span>
          <span className="absolute bottom-2 right-2 text-[8px] font-mono text-[#C9473B] leading-none">+</span>
        </div>
      ) : cursorText ? (
        /* Text Badge Cursor */
        <div className="px-3 py-1.5 bg-[#C9473B] text-white rounded-full font-satoshi text-[9px] font-bold tracking-[0.2em] uppercase shadow-lg flex items-center justify-center animate-in zoom-in-50 duration-150">
          {cursorText}
        </div>
      ) : (
        /* Minimalist Smooth Ring Cursor */
        <div
          className={`rounded-full transition-all duration-200 flex items-center justify-center ${
            isHovered
              ? 'w-10 h-10 border border-[#C9473B] bg-[#C9473B]/10 backdrop-blur-2xs'
              : 'w-3 h-3 bg-[#C9473B]'
          }`}
        >
          {isHovered && <div className="w-1.5 h-1.5 rounded-full bg-[#C9473B]" />}
        </div>
      )}
    </div>
  );
};
