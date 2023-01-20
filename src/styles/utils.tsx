export const hsl = ({
  hue,
  saturation,
  lightness,
}: {
  hue: number;
  saturation: number;
  lightness: number;
}): string =>
  `hsl(${hue.toString()}, ${saturation.toString()}%, ${lightness.toString()}%)`;

export const hsla = ({
  hue,
  saturation,
  lightness,
  alpha,
}: {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
}): string =>
  `hsla(${hue.toString()}, ${saturation.toString()}%, ${lightness.toString()}%, ${alpha.toString()})`;
