import { RGBA } from 'jimp';

import { PatternMap } from '../modules/PatternMap';
import { colorUtils } from '../utils/colorUtils';

/** Result of png2asm conversion handler. */
export type Png2AsmResult = {
  /** default result. */
  lines: string[];
  /** other resolts. */
  [key: string]: string[];
};

/** png2asm conversion handler. */
export type Png2AsmHandler = (patternMap: PatternMap) => Promise<Png2AsmResult>;

/** simple binary color convertor. */
export const binaryConverter = (rgba: RGBA): boolean =>
  colorUtils.getBinaryColor(rgba, 1, 127);
