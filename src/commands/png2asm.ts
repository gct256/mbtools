import path from 'path';

import { outputFile } from 'fs-extra';

import { msxSprite8 } from '../png2asm/msxSprite8';
import { msxSprite16 } from '../png2asm/msxSprite16';
import { PatternMap } from '../modules/PatternMap';
import { Png2AsmHandler } from '../png2asm/utils';
import { msxScreen2 } from '../png2asm/msxScreen2';
import { Conf } from '../modules/Conf';

/**
 * Get conversion handler from file name.
 *
 * @param name file name
 */
const getHandler = (name: string): Png2AsmHandler => {
  const n = name.toLowerCase();

  if (n.endsWith('.msx_sprite_8.png')) return msxSprite8;

  if (n.endsWith('.msx_sprite_16.png')) return msxSprite16;

  if (n.endsWith('.msx_screen_2.png')) return msxScreen2;

  throw new Error(`unsupported png file: ${name}`);
};

/**
 * Implementaion of CLI Command: png2asm
 */
export const png2asm = async (conf: Conf, filePath: string): Promise<void> => {
  const aPath = path.resolve(filePath);

  const handler = getHandler(path.basename(aPath));
  const result = await handler(await PatternMap.createFromFile(aPath));
  const { lines } = result;

  const outputFilePath = `${aPath}${conf.pp.ext}`;

  await outputFile(outputFilePath, lines.join('\n'));

  // eslint-disable-next-line no-console
  console.log(`write: ${outputFilePath}`);

  await Promise.all(
    Object.keys(result)
      .filter((key) => key !== 'lines')
      .map(async (key) => {
        const out = `${aPath}.${key}${conf.pp.ext}`;

        await outputFile(out, result[key].join('\n'));

        // eslint-disable-next-line no-console
        console.log(`write: ${out}`);
      }),
  );
};
