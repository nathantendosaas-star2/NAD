/**
 * Build responsive sources for Unsplash and NAD's own WordPress media library.
 * This lets browsers fetch smaller files for cards and sharper files for detail
 * views without using a single oversized image everywhere.
 */
export function getResponsiveImageProps(
  source: string,
  sizes: string
): { src: string; srcSet?: string; sizes: string } {
  try {
    const url = new URL(source);

    if (url.hostname === 'images.unsplash.com') {
      const build = (width: number) => {
        const candidate = new URL(url.toString());
        candidate.searchParams.set('auto', 'format');
        candidate.searchParams.set('fit', 'crop');
        candidate.searchParams.set('q', '82');
        candidate.searchParams.set('w', String(width));
        return candidate.toString();
      };

      const widths = [480, 768, 1200, 1600, 2000];
      return {
        src: build(1200),
        srcSet: widths.map((width) => `${build(width)} ${width}w`).join(', '),
        sizes,
      };
    }

    if (url.hostname === 'nairobiappareldistrict.com') {
      const productMatch = url.pathname.match(/^(.*)-762x1024(\.[^.]+)$/i);
      const categoryMatch = url.pathname.match(/^(.*)-819x1024(\.[^.]+)$/i);

      if (productMatch) {
        const [, base, extension] = productMatch;
        const variants: Array<[number, string]> = [
          [223, '-223x300'],
          [300, '-300x403'],
          [600, '-600x806'],
          [762, '-762x1024'],
          [768, '-768x1032'],
          [1080, ''],
        ];
        const srcSet = variants.map(([width, suffix]) => {
          const candidate = new URL(url.toString());
          candidate.pathname = `${base}${suffix}${extension}`;
          return `${candidate.toString()} ${width}w`;
        }).join(', ');
        return { src: source, srcSet, sizes };
      }

      if (categoryMatch) {
        const [, base, extension] = categoryMatch;
        const variants: Array<[number, string]> = [
          [240, '-240x300'],
          [300, '-300x375'],
          [600, '-600x750'],
          [768, '-768x960'],
          [819, '-819x1024'],
          [1080, ''],
        ];
        const srcSet = variants.map(([width, suffix]) => {
          const candidate = new URL(url.toString());
          candidate.pathname = `${base}${suffix}${extension}`;
          return `${candidate.toString()} ${width}w`;
        }).join(', ');
        return { src: source, srcSet, sizes };
      }
    }

    return { src: source, sizes };
  } catch {
    return { src: source, sizes };
  }
}
