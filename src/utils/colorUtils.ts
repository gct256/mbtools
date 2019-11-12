import { RGBA } from 'jimp';

/** Function of color conversion. */
export type ColorConverter<T> = (color: RGBA) => T;

/*
- https://en.wikipedia.org/wiki/List_of_8-bit_computer_hardware_graphics
*/

/** Color of TMS9918 */
const TMS9918ColorSet: RGBA[] = [
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x3e, g: 0xb8, b: 0x49, a: 0xff },
  { r: 0x74, g: 0xd0, b: 0x7d, a: 0xff },
  { r: 0x59, g: 0x55, b: 0xe0, a: 0xff },
  { r: 0x80, g: 0x76, b: 0xf1, a: 0xff },
  { r: 0xb9, g: 0x5e, b: 0x51, a: 0xff },
  { r: 0x65, g: 0xdb, b: 0xef, a: 0xff },
  { r: 0xdb, g: 0x65, b: 0x59, a: 0xff },
  { r: 0xff, g: 0x89, b: 0x7d, a: 0xff },
  { r: 0xcc, g: 0xc3, b: 0x5e, a: 0xff },
  { r: 0xde, g: 0xd0, b: 0x87, a: 0xff },
  { r: 0x3a, g: 0xa2, b: 0x41, a: 0xff },
  { r: 0xb7, g: 0x66, b: 0xb5, a: 0xff },
  { r: 0xcc, g: 0xcc, b: 0xcc, a: 0xff },
  { r: 0xff, g: 0xff, b: 0xff, a: 0xff },
];

/** [TODO] Colors of V9938. */
const V9938ColorSet: RGBA[] = [
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
  { r: 0x00, g: 0x00, b: 0x00, a: 0xff },
];

/**
 * Get color difference factor.
 *
 * @param c0
 * @param c1
 */
const getColorDiff = (c0: RGBA, c1: RGBA): number =>
  (c0.r - c1.r) ** 2 + (c0.g - c1.g) ** 2 + (c0.b - c1.b) ** 2;

/** Utilities of color. */
export const colorUtils = {
  TMS9918ColorSet,
  V9938ColorSet,

  /**
   * Get nealy color code.
   *
   * @param color
   */
  getNealyColorCode(color: RGBA, colorSet: RGBA[]): number {
    let num = 0;
    let diff: number = 255 ** 2 * 3;

    colorSet.forEach((c: RGBA, i: number) => {
      const d = getColorDiff(c, color);

      if (d < diff) {
        num = i;
        diff = d;
      }
    });

    return num === 0 ? 1 : num;
  },

  /**
   * Get binary color using threshold.
   *
   * @param rgba
   * @param threshold RGB threshold. (0-255)
   * @param alphaThreshold alpha channel threshold. (0-255)
   */
  getBinaryColor(
    { r, g, b, a }: RGBA,
    threshold: number,
    alphaThreshold: number = threshold,
  ): boolean {
    if (a <= alphaThreshold) return false;

    return r > threshold && g > threshold && b > threshold;
  },
};
