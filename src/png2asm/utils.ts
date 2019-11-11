import { RGBA } from 'jimp';

import { PatternMap } from '../modules/PatternMap';
import { colorUtils } from '../utils/colorUtils';

export type Png2AsmResult = {
  lines: string[];
  [key: string]: string[];
};

export type Png2AsmHandler = (patternMap: PatternMap) => Promise<Png2AsmResult>;

export const binaryConverter = (rgba: RGBA): boolean =>
  colorUtils.getBinaryColor(rgba, 1, 127);
