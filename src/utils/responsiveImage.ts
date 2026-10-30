/**
 * Build responsive Unsplash URLs so the browser downloads an image sized for
 * the rendered slot instead of always fetching the largest source.
 */
export function getResponsiveImageProps(
  source: string,
  sizes: string
): { src: string; srcSet?: string; sizes: string } {
  try {
    const url = new URL(source);
    if (url.hostname !== 'images.unsplash.com') {
      return { src: source, sizes };
    }

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
  } catch {
    return { src: source, sizes };
  }
}
