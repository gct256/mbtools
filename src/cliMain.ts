import yargs from 'yargs';

import { setup } from './commands/setup';
import { watch } from './commands/watch';
import { js2asm } from './commands/js2asm';
import { png2asm } from './commands/png2asm';
import { shrink } from './commands/shrink';
import { config } from './commands/config';
import { Conf, CONF_FILE_NAME } from './modules/Conf';

enum Command {
  CONFIG = 'config',
  SETUP = 'setup',
  WATCH = 'watch',
  JS2ASM = 'js2asm',
  PNG2ASM = 'png2asm',
  SHRINK = 'shrink',
}

const cliMain = async (): Promise<void> => {
  const args = yargs
    .locale('en')
    .strict()
    .usage('$0 COMMAND [OPTIONS]')
    .demandCommand(1, 1, '', '')
    .alias('v', 'version')
    .alias('h', 'help')
    .command(Command.CONFIG, 'Create configuration intractive.')
    .command(Command.SETUP, 'Create Makefile into current directory.')
    .command(`${Command.WATCH}`, 'Watch and make.')
    .command(
      `${Command.JS2ASM} file ext`,
      'Generate asm source file from JavaScript.',
      (y) => y.string(['file', 'ext']),
    )
    .command(
      `${Command.PNG2ASM} file ext`,
      'Generate assembler source file from PNG image.',
      (y) => y.string(['file', 'ext']),
    )
    .command(`${Command.SHRINK} size in out`, 'Shrink file size.', (y) =>
      y.string(['size', 'in', 'out']),
    );

  const command = args.argv._[0];
  const arg1 = args.argv._[1];
  const arg2 = args.argv._[2];
  const arg3 = args.argv._[3];

  if (command === Command.CONFIG) {
    await config();

    return;
  }

  const conf = await Conf.load();

  if (!conf.exists) {
    console.warn(`${CONF_FILE_NAME} not found.`);
    process.exit(1);
  }

  switch (command) {
    case Command.SETUP:
      await setup(conf);
      break;

    case Command.WATCH:
      await watch(conf);
      break;

    case Command.JS2ASM:
      await js2asm(conf, arg1);
      break;

    case Command.PNG2ASM:
      await png2asm(conf, arg1);
      break;

    case Command.SHRINK:
      await shrink(arg1, arg2, arg3);
      break;

    default:
  }
};

cliMain();
