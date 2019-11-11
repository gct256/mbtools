import os from 'os';
import path from 'path';

import { pathExists, readJson, outputFile } from 'fs-extra';
import Ajv from 'ajv';

export const CONF_FILE_NAME = '.mbtoolsrc.json';

const filePath = path.resolve(os.homedir(), CONF_FILE_NAME);

type AsmConfData = { type: string; path: string; ext: string };
type EmuConfData = { type: string; path: string };
type PPConfData = { ext: string };
type DestConfData = { ext: string };
export type ConfData = {
  asm: AsmConfData;
  emu: EmuConfData;
  pp: PPConfData;
  dest: DestConfData;
};

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

export class Conf implements ConfData {
  public readonly filePath: string = filePath;
  public readonly exists: boolean;
  public readonly asm: Readonly<AsmConfData>;
  public readonly emu: Readonly<EmuConfData>;
  public readonly pp: Readonly<PPConfData>;
  public readonly dest: Readonly<DestConfData>;

  private constructor(exists: boolean, data: ConfData) {
    this.exists = exists;
    this.asm = { ...data.asm };
    this.emu = { ...data.emu };
    this.pp = { ...data.pp };
    this.dest = { ...data.dest };
  }

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

  public static async create(data: ConfData): Promise<void> {
    await outputFile(filePath, JSON.stringify(data, null, 2));
    // eslint-disable-next-line no-console
    console.log(`write: ${filePath}`);
  }
}
