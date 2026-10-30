/** Keep externally hosted demo photography as a single known-good source. */
export function getResponsiveImageProps(
  source: string,
  sizes: string
): { src: string; srcSet?: string; sizes: string } {
  return { src: source, sizes };
}
