import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect for the image inside the mask
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
        <motion.img
          src={src}
          alt={alt}
          style={{ y, scale }}
          className={`w-full h-full transition-transform duration-700 ease-out ${className.includes('object-') ? '' : 'object-cover'} ${className}`}
        />
      </motion.div>
    </div>
  );
}
