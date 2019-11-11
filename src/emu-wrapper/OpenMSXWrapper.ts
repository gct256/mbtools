import { ChildProcess, spawn } from 'child_process';
import { Writable, Readable } from 'stream';

import executable from 'executable';

import { EmuWrapper } from './EmuWrapper';

const firstReply = '<openmsx-output>\x0a';

/**
 * 結果を文字列化
 *
 * @param result 結果
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertResult = (result: any): string => {
  if (typeof result === 'string') return result;

  if (result instanceof Buffer) return result.toString();

  return `${result}`;
};

/** OpenMSXラッパークラス */
export class OpenMSXWrapper extends EmuWrapper {
  public readonly name: string = 'openmsx';

  private openmsxPath = '';
  private process: ChildProcess | undefined;

  public get stdin(): Writable {
    if (this.process === undefined) throw new Error('not connected.');

    if (this.process.stdin === null) throw new Error('stdin not found.');

    return this.process.stdin;
  }

  public get stdout(): Readable {
    if (this.process === undefined) throw new Error('not connected.');

    if (this.process.stdout === null) throw new Error('stdout not found.');

    return this.process.stdout;
  }

  public async initialize(
    filePath: string,
    onClose: () => void,
  ): Promise<void> {
    if (this.process !== undefined) return Promise.resolve();

    if (!(await executable(filePath))) {
      throw new Error('not a executable file');
    }

    return new Promise((resolve: () => void): void => {
      this.openmsxPath = filePath;

      const process = spawn(this.openmsxPath, ['-control', 'stdio']);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      process.stdout.once('data', (data: any) => {
        if (convertResult(data) === firstReply) {
          this.process = process;
          resolve();
        }
      });

      process.once('close', () => {
        onClose();
      });
    });
  }

  public async close(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = undefined;
    }
  }

  public async boot(): Promise<void> {
    await this.send('exta debugdevice');
    await this.send('set renderer SDL');
    await this.send('set power on');
  }

  public async start(cart: string): Promise<void> {
    await this.send('set power off');
    await this.send(`carta ${cart}`);
    await this.send('exta debugdevice');
    await this.send('set power on');
  }

  /**
   * openmsxにコマンドを送る
   *
   * @param command コマンド
   */
  private async send(command: string): Promise<string> {
    return new Promise((resolve: (result: string) => void) => {
      if (this.process === undefined) throw new Error('not opened');
      this.stdin.write(`<command>${command}</command>`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.stdout.once('data', (data: any) => {
        const result: string = convertResult(data).trim();

        resolve(result);
      });
    });
  }
}
