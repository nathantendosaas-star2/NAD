import React, { useEffect, useState } from 'react';
import { getResponsiveImageProps } from '../utils/responsiveImage';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  wrapperClassName?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Product display',
  className = '',
  wrapperClassName = '',
  fallbackText,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw',
  onLoad,
  onError,
  ...props
}) => {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    if (imgRef.current && imgRef.current.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
      } else {
        setHasError(true);
      }
    }
  }, [src]);

  const responsive = src ? getResponsiveImageProps(src, sizes) : null;

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#fffaf4_0%,#e8dfd3_58%,#d7cbbd_100%)] text-[#C9473B] p-4 text-center select-none ${wrapperClassName || className}`}
      >
        <span className="font-clash text-xl uppercase tracking-tighter opacity-60">NAD</span>
        <span className="font-satoshi text-[11px] uppercase tracking-widest opacity-70 mt-2">
          {fallbackText || alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(110deg,#e9e3da_8%,#f8f4ed_18%,#e9e3da_33%)] bg-[length:200%_100%] animate-pulse"
        />
      )}
      <img
        {...props}
        ref={imgRef}
        src={responsive!.src}
        srcSet={responsive!.srcSet}
        sizes={responsive!.sizes}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          console.warn('[NAD image] Failed to load:', responsive?.src || src);
          setHasError(true);
          onError?.(event);
        }}
        className={`relative transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  );
};
