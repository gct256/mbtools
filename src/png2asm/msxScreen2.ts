import { RGBA } from 'jimp';

import { PatternMap } from '../modules/PatternMap';
import { asmUtils } from '../utils/asmUtils';
import { colorUtils } from '../utils/colorUtils';

import { Png2AsmResult } from './utils';

export const msxScreen2 = async (
  patternMap: PatternMap,
): Promise<Png2AsmResult> => {
  const { patternWidth, patternHeight, colCount, rowCount } = patternMap;
  const patterns: number[] = [];
  const colors: number[] = [];
  const converter = (color: RGBA): number =>
    colorUtils.getNealyColorCode(color, colorUtils.TMS9918ColorSet);

  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      for (let y = 0; y < patternHeight; y += 1) {
        const c = patternMap.getColors(
          col * patternWidth,
          row * patternHeight + y,
          patternWidth,
          1,
          converter,
        );
        // 二色に正規化
        const c0 = c[0];
        const c1 = c.find((x) => x !== c0) || 0;

        colors.push(c0 * 16 + c1);

        // 最初の色でパターン化
        patterns.push(
          ...patternMap.getPattern(
            col,
            row,
            1,
            (color) => converter(color) === c0,
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
