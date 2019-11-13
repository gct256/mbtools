import { RGBA } from 'jimp';

import { PatternMap } from '../modules/PatternMap';
import { asmUtils } from '../utils/asmUtils';
import { colorUtils } from '../utils/colorUtils';
import { sortUtils } from '../utils/sortUtils';

import { Png2AsmResult } from './utils';

/**
 * Convert bitmap to 8x8 bit patterns and 8x8 color data.
 *
 * @param patternMap
 */
export const msxScreen2 = async (
  patternMap: PatternMap,
): Promise<Png2AsmResult> => {
  const { patternWidth, patternHeight, colCount, rowCount } = patternMap;
  const patterns: number[] = [];
  const colors: number[] = [];
  const converter = (color: RGBA): number =>
    color.a < 127
      ? 0
      : colorUtils.getNealyColorCode(color, colorUtils.TMS9918ColorSet);

  const compare = ([, a]: [number, number], [, b]: [number, number]): number =>
    sortUtils.compare(b, a);

  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      for (let y = 0; y < patternHeight; y += 1) {
        const lineColors = patternMap.getColors(
          col * patternWidth,
          row * patternHeight + y,
          patternWidth,
          1,
          converter,
        );

        // sort by color count
        const counts = [
          ...lineColors.reduce(
            (c, x) => c.set(x, (c.get(x) || 0) + 1),
            new Map<number, number>(),
          ),
        ].sort(compare);

        // use first 2 color
        const c0 = counts.length > 0 ? counts[0][0] : 0;
        const c1 = counts.length > 1 ? counts[1][0] : 0;

        colors.push(c0 * 16 + c1);

        patterns.push(
          ...patternMap.getPattern(
            col,
            row,
            y,
            y,
            (color) => converter(color) !== c1,
          ),
        );
      }
    }
  }

  return {
    lines: asmUtils.toDbRows(patternWidth, ...patterns),
    colors: asmUtils.toDbRows(patternWidth, ...colors),
  };
};
