import path from 'path';
import { spawn } from 'child_process';

import globby from 'globby';
import { watch as chokidar } from 'chokidar';

import { Conf } from '../modules/Conf';
import { OpenMSXWrapper } from '../emu-wrapper/OpenMSXWrapper';
import { EmuWrapper } from '../emu-wrapper/EmuWrapper';

/**
 * Get emulator wrapper object for emulator type.
 *
 * @param type emulator type.
 */
const getEmuWrapper = (type: string): EmuWrapper => {
  if (type === 'openmsx') return new OpenMSXWrapper();

  throw new Error(`unsupported emulator type: ${type}`);
};

/**
 * Run make.
 *
 * @param task task name.
 */
const make = async (task: string): Promise<void> => {
  spawn('make', [task]);
};

/**
 * Callback when file updated.
 *
 * @param filePath
 * @param conf  configuration
 * @param wrapper emulator wrapper
 */
const update = async (
  filePath: string,
  conf: Conf,
  wrapper: EmuWrapper,
): Promise<void> => {
  console.debug(`update: ${filePath}`);

  if (filePath.endsWith(conf.dest.ext)) {
    await wrapper.start(filePath);
  } else {
    make('build');
  }
};

/**
 * Implementaion of CLI Command: shrink
 *
 * @param conf configuration.
 */
export const watch = async (conf: Conf): Promise<void> => {
  await make('all');

  const dir = path.resolve('.');

  const dests = await globby(path.resolve(dir, '**', `*${conf.dest.ext}`));

  const wrapper = getEmuWrapper(conf.emu.type);

  await wrapper.initialize(conf.emu.path, () => process.exit(0));
  await wrapper.boot();

  if (dests[0] !== undefined) await wrapper.start(dests[0]);

  const watcher = chokidar([
    path.resolve(dir, '**', `*${conf.dest.ext}`),
    path.resolve(dir, '**', `*${conf.asm.ext}`),
    path.resolve(dir, '**', '*.js'),
    path.resolve(dir, '**', '*.png'),
  ]);

  watcher.once('ready', () => {
    watcher.on('add', (filePath: string) => {
      update(filePath, conf, wrapper);
    });
    watcher.on('change', (filePath: string) => {
      update(filePath, conf, wrapper);
    });
  });
};
