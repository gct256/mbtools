import { PatternMap } from '../modules/PatternMap';
import { asmUtils } from '../utils/asmUtils';

import { Png2AsmResult, binaryConverter } from './utils';

/**
 * Convert bitmap to 8x8 bit patterns.
 *
 * @param patternMap
 */
export const msxSprite8 = async (
  patternMap: PatternMap,
): Promise<Png2AsmResult> => {
  const { patternHeight, colCount, rowCount } = patternMap;
  const lines: string[] = [];

  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      lines.push(
        asmUtils.comment(`(${col}, ${row})`),
        ...asmUtils.toDb2(
          ...patternMap.getPattern(
            col,
            row,
            0,
            patternHeight - 1,
            binaryConverter,
          ),
        ),
      );
    }
  }

  return { lines };
};
