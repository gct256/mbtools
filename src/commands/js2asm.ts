import path from 'path';

import { outputFile } from 'fs-extra';

import { asmUtils } from '../utils/asmUtils';
import { Conf } from '../modules/Conf';

/**
 * Convert JavaScript data to assembler source.
 *
 * @param data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convert = (data: any): string[] => {
  if (data === null || data === undefined) return [];

  if (Array.isArray(data)) {
    return data.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (x: string[], y: any): string[] => [...x, ...convert(y)],
      [],
    );
  }

  if (
    data instanceof Int8Array ||
    data instanceof Uint8Array ||
    data instanceof Uint8ClampedArray
  ) {
    return asmUtils.toDbRows(8, ...Array.from(data));
  }

  if (data instanceof Int16Array || data instanceof Uint16Array) {
    return asmUtils.toDwRows(8, ...Array.from(data));
  }

  if (typeof data === 'string') {
    return [asmUtils.toDbString(data)];
  }

  if (typeof data === 'number') {
    return [asmUtils.toDb(data)];
  }

  if (typeof data === 'boolean') {
    return [asmUtils.toDb(data ? 1 : 0)];
  }

  return [];
};

/**
 * Implementaion of CLI Command: js2asm
 */
export const js2asm = async (conf: Conf, filePath: string): Promise<void> => {
  const aPath = path.resolve(filePath);

  delete require.cache[aPath];

  // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-var-requires, global-require
  const js = require(aPath);
  const data: string[] = convert(js);

  data.push('');

  const outputFilePath = `${aPath}${conf.pp.ext}`;

  await outputFile(outputFilePath, data.join('\n'));

  // eslint-disable-next-line no-console
  console.log(`write: ${outputFilePath}`);
};
