import inquirer from 'inquirer';

import { Conf, CONF_FILE_NAME, ConfData } from '../modules/Conf';

export const config = async (): Promise<void> => {
  const conf = await Conf.load();

  if (conf.exists) {
    const { overwrite } = await inquirer.prompt<{ overwrite: boolean }>([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `${CONF_FILE_NAME} already exists. Overwrite?`,
        default: false,
      },
    ]);

    if (!overwrite) {
      console.error('canceled.');
      process.exit(0);
    }
  }

  const transformer = (x: string): string => x.trim();
  const validate = (value: string): string | boolean => {
    return value.trim().length === 0 ? 'required parameter' : true;
  };

  const result = await inquirer.prompt<ConfData>([
    {
      type: 'list',
      name: 'asm.type',
      message: 'Type of assembler.',
      default: conf.exists ? conf.asm.type : 'pasmo',
      choices: ['pasmo'],
      transformer,
      validate,
    },
    {
      type: 'input',
      name: 'asm.path',
      message: 'File path of assembler executable',
      default: conf.exists ? conf.asm.path : 'pasmo',
      transformer,
      validate,
    },
    {
      type: 'input',
      name: 'asm.ext',
      message: 'Extname of assembler source file.',
      default: conf.exists ? conf.asm.ext : '.asm',
      transformer,
      validate,
    },
    {
      type: 'list',
      name: 'emu.type',
      message: 'Type of emulator.',
      default: conf.exists ? conf.emu.type : 'openmsx',
      choices: ['openmsx'],
      transformer,
      validate,
    },
    {
      type: 'input',
      name: 'emu.path',
      message: 'File path of emulator executable',
      default: conf.exists ? conf.emu.path : 'openmsx',
      transformer,
      validate,
    },
    {
      type: 'input',
      name: 'pp.ext',
      message: 'Extname of preprocessed file.',
      default: conf.exists ? conf.pp.ext : '.inc',
      transformer,
      validate,
    },
    {
      type: 'input',
      name: 'dest.ext',
      message: 'Extname of destination file.',
      default: conf.exists ? conf.dest.ext : '.rom',
      transformer,
      validate,
    },
  ]);

  Conf.create(result);
};
