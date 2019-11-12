import os from 'os';
import path from 'path';

import { pathExists, readJson, outputFile } from 'fs-extra';
import Ajv from 'ajv';

/** Name of configuration file. */
export const CONF_FILE_NAME = '.mbtoolsrc.json';

const filePath = path.resolve(os.homedir(), CONF_FILE_NAME);

/** Configuration. */
export type ConfData = {
  /** Configuration of assembler. */
  asm: {
    /** Type of assembler. */
    type: string;
    /** File path of assembler executable. */
    path: string;
    /** Extname of assembler source file. */
    ext: string;
  };
  /** Configuration of emulator. */
  emu: {
    /** Type of emulator. */
    type: string;
    /** File path of emulator executable. */
    path: string;
  };
  /** Configuration of preprocessor. */
  pp: {
    /** Extname of preprocess result file. */
    ext: string;
  };
  /** Configuration of destination. */
  dest: {
    /** Extname of destination file. */
    ext: string;
  };
};

/** JSON schema for configuration. */
const CONF_SCHEMA = {
  definitions: {},
  type: 'object',
  required: ['asm', 'emu', 'pp', 'dest'],
  properties: {
    asm: {
      type: 'object',
      required: ['type', 'path', 'ext'],
      properties: {
        type: { type: 'string', default: '' },
        path: { type: 'string', default: '' },
        ext: { type: 'string', default: '' },
      },
    },
    emu: {
      type: 'object',
      required: ['type', 'path'],
      properties: {
        type: { type: 'string', default: '' },
        path: { type: 'string', default: '' },
      },
    },
    pp: {
      type: 'object',
      required: ['ext'],
      properties: {
        ext: { type: 'string', default: '' },
      },
    },
    dest: {
      type: 'object',
      required: ['ext'],
      properties: {
        ext: { type: 'string', default: '' },
      },
    },
  },
};

const emptyConfig: ConfData = {
  asm: { type: '', path: '', ext: '' },
  emu: { type: '', path: '' },
  pp: { ext: '' },
  dest: { ext: '' },
};

/** Configuration class. */
export class Conf implements ConfData {
  /** File path of configuration file. */
  public readonly filePath: string = filePath;

  /** If true, configuration file exists. */
  public readonly exists: boolean;

  public readonly asm: Readonly<ConfData['asm']>;
  public readonly emu: Readonly<ConfData['emu']>;
  public readonly pp: Readonly<ConfData['pp']>;
  public readonly dest: Readonly<ConfData['dest']>;

  private constructor(exists: boolean, data: ConfData) {
    this.exists = exists;
    this.asm = { ...data.asm };
    this.emu = { ...data.emu };
    this.pp = { ...data.pp };
    this.dest = { ...data.dest };
  }

  /**
   * Load configuration from configuration file on home directory.
   */
  public static async load(): Promise<Conf> {
    if (!(await pathExists(filePath))) {
      return new Conf(false, emptyConfig);
    }

    const json = await readJson(filePath);
    const ajv = new Ajv({ useDefaults: true });
    const valid = ajv.validate(CONF_SCHEMA, json);

    if (!valid) return new Conf(true, emptyConfig);

    return new Conf(true, json);
  }

  /**
   * Write configuration data to configuration file on home directory. Force overwrite.
   *
   * @param data configuration data.
   */
  public static async create(data: ConfData): Promise<void> {
    await outputFile(filePath, JSON.stringify(data, null, 2));
    // eslint-disable-next-line no-console
    console.log(`write: ${filePath}`);
  }
}
