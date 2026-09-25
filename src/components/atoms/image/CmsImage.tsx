import React from 'react';
import Image, { type ImageProps } from 'next/image';
import { optimizeMediaUrl } from '@/infrastructure/cms/mediaUrl';

export interface CmsImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  /**
   * Target width passed to Cloudflare image optimization pipeline for CMS assets.
   */
  optimizeWidth?: number;
  /**
   * Quality setting for image optimization (default: 80).
   */
  quality?: number;
}

/**
 * CmsImage Atom
 *
 * Universal image component that integrates:
 * 1. Same-origin reverse proxying via `/opti-media/` to defeat Firefox ETP tracker blocking.
 * 2. Automatic Cloudflare image resizing & modern format (WebP/AVIF) negotiation.
 * 3. Prevention of Next.js aspect-ratio mismatch warnings (`heightModified !== widthModified`)
 *    by guaranteeing synchronized responsive styles when fixed width/height are specified.
 */
export function CmsImage({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  className,
  style,
  optimizeWidth,
  quality = 80,
  ...restProps
}: CmsImageProps) {
  // Ensure the image URL routes through the first-party /opti-media/ proxy if it originates from Optimizely CMS / CMP
  const effectiveWidth = optimizeWidth ?? (typeof width === 'number' ? width : undefined);
  const resolvedSrc = optimizeMediaUrl(src, {
    width: effectiveWidth,
    quality: typeof quality === 'number' ? quality : 80,
    format: 'auto',
  });

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        sizes={sizes ?? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        className={className}
        style={style}
        {...restProps}
      />
    );
  }

  // When width and height are provided, ensure style maintains aspect ratio without Next.js warnings
  const responsiveStyle: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    ...style,
  };

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      style={responsiveStyle}
      {...restProps}
    />
  );
}

export default CmsImage;
