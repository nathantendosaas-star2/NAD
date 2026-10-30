import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function ImageReveal({
  src,
  alt,
  className = '',
  containerClassName = '',
  delay = 0,
  direction = 'up'
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect for the image inside the mask.
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

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
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }
    }
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ willChange: 'clip-path' }}
    >
      <motion.div
        variants={variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="w-full h-full"
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
          <motion.img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            style={{ y, scale }}
            className={`w-full h-full transition-transform duration-700 ease-out ${className.includes('object-') ? '' : 'object-cover'} ${className}`}
          />
        )}
      </motion.div>
    </div>
  );
}
