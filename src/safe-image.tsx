import { useState, type ImgHTMLAttributes } from 'react';
import { Music2 } from 'lucide-react';

const fallbackImageClass =
  'flex items-center justify-center bg-[linear-gradient(135deg,#EFE6D6,#FBF6EC)] text-[#AF8C43]';
const responsiveImageWidths = [480, 768, 1024, 1360, 1680];
const defaultResponsiveImageSizes = '(min-width: 1280px) 46vw, (min-width: 768px) 70vw, 100vw';

const buildOptimizedImageUrl = (source: string, width: number) => {
  try {
    const url = new URL(source);
    if (!url.hostname.includes('images.unsplash.com')) return null;
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', url.searchParams.get('fit') || 'crop');
    url.searchParams.set('q', url.searchParams.get('q') || '80');
    url.searchParams.set('w', String(width));
    return url.toString();
  } catch {
    return null;
  }
};

const getResponsiveImageAttributes = (source?: string, srcSet?: string, sizes?: string) => {
  if (!source || srcSet) return { src: source, srcSet, sizes };
  const optimizedUrls = responsiveImageWidths
    .map((width) => {
      const url = buildOptimizedImageUrl(source, width);
      return url ? `${url} ${width}w` : null;
    })
    .filter(Boolean)
    .join(', ');

  if (!optimizedUrls) return { src: source, srcSet, sizes };

  return {
    src: buildOptimizedImageUrl(source, 1024) ?? source,
    srcSet: optimizedUrls,
    sizes: sizes ?? defaultResponsiveImageSizes,
  };
};

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  /* 'shimmer' shows an animated ivory placeholder while src is still empty
     (e.g. hero/portrait waiting on remote content) instead of the icon box. */
  placeholder?: 'icon' | 'shimmer';
}

export function SafeImage({ src, alt = '', className = '', fallbackClassName = '', onError, srcSet, sizes, placeholder = 'icon', ...props }: SafeImageProps) {
  const sourceKey = src || '';
  const [failedSource, setFailedSource] = useState<string | undefined>(undefined);
  const responsiveImage = getResponsiveImageAttributes(src, srcSet, sizes);
  const hasFailed = failedSource === sourceKey;

  if (!src && placeholder === 'shimmer' && !hasFailed) {
    return <div aria-hidden="true" className={`${className} img-shimmer`} />;
  }

  if (!src || hasFailed) {
    return (
      <div role={alt ? 'img' : undefined} aria-label={alt || undefined} className={`${className} ${fallbackImageClass} ${fallbackClassName}`}>
        <Music2 size={24} />
      </div>
    );
  }

  return (
    <img
      src={responsiveImage.src}
      srcSet={responsiveImage.srcSet}
      sizes={responsiveImage.sizes}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={(event) => {
        setFailedSource(sourceKey);
        onError?.(event);
      }}
      {...props}
    />
  );
}
