import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { getResponsiveImageProps } from '../utils/responsiveImage';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Load above-the-fold imagery immediately and give it high network priority. */
  priority?: boolean;
  /** Approximate rendered width, used by the browser to choose a responsive source. */
  sizes?: string;
}

export function ImageReveal({
  src,
  alt,
  className = '',
  containerClassName = '',
  delay = 0,
  direction = 'up',
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageFailed(false);
    setImageLoaded(false);
  }, [src]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const responsive = src ? getResponsiveImageProps(src, sizes) : null;

  const variants = {
    hidden: {
      clipPath: direction === 'up' ? 'inset(100% 0% 0% 0%)' :
                direction === 'down' ? 'inset(0% 0% 100% 0%)' :
                direction === 'left' ? 'inset(0% 0% 0% 100%)' :
                'inset(0% 100% 0% 0%)',
      opacity: 0,
    },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }
    }
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="relative w-full h-full"
      >
        {imageFailed || !src ? (
          <div
            role="img"
            aria-label={alt}
            className="w-full h-full min-h-[180px] flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(ellipse_at_50%_35%,#fffaf4_0%,#e8dfd3_58%,#d7cbbd_100%)] text-[#C9473B]"
          >
            <span className="font-serif-heavy text-[clamp(2rem,6vw,5rem)] leading-none tracking-[-0.08em]">NAD</span>
            <span className="mt-4 max-w-[18rem] text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#6E685E]">
              {alt}
            </span>
            <span className="mt-3 text-[8px] font-mono uppercase tracking-[0.24em] text-[#C9473B]/70">
              Nairobi Apparel District
            </span>
          </div>
        ) : (
          <>
            {!imageLoaded && (
              <div
                aria-hidden="true"
                className="absolute inset-0 z-10 bg-[linear-gradient(110deg,#e9e3da_8%,#f8f4ed_18%,#e9e3da_33%)] bg-[length:200%_100%] animate-pulse"
              />
            )}
            <motion.img
              src={responsive!.src}
              srcSet={responsive!.srcSet}
              sizes={responsive!.sizes}
              alt={alt}
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : 'auto'}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
              style={{ y, scale }}
              className={`w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${className.includes('object-') ? '' : 'object-cover'} ${className}`}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
