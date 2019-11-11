import { PatternMap } from '../modules/PatternMap';
import { asmUtils } from '../utils/asmUtils';

import { Png2AsmResult, binaryConverter } from './utils';

export const msxSprite16 = async (
  patternMap: PatternMap,
): Promise<Png2AsmResult> => {
  const { patternHeight, colCount, rowCount } = patternMap;
  const lines: string[] = [];

  for (let row = 0; row < rowCount; row += 2) {
    for (let col = 0; col < colCount; col += 2) {
      lines.push(
        asmUtils.comment(`(${row / 2}, ${col / 2}) - upper left`),
        ...asmUtils.toDb2(
          ...patternMap.getPattern(
            col,
            row,
            0,
            patternHeight - 1,
            binaryConverter,
          ),
        ),
        asmUtils.comment(`(${row / 2}, ${col / 2}) - lower left`),
        ...asmUtils.toDb2(
          ...patternMap.getPattern(
            col,
            row + 1,
            0,
            patternHeight - 1,
            binaryConverter,
          ),
        ),
        asmUtils.comment(`(${row / 2}, ${col / 2}) - upper right`),
        ...asmUtils.toDb2(
          ...patternMap.getPattern(
            col + 1,
            row,
            0,
            patternHeight - 1,
            binaryConverter,
          ),
        ),
        asmUtils.comment(`(${row / 2}, ${col / 2}) - lower right`),
        ...asmUtils.toDb2(
          ...patternMap.getPattern(
            col + 1,
            row + 1,
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
