import { execFile } from 'child_process';

/**
 * Promisified child_process.execFile.
 *
 * @param file
 * @param args
 */
export const execFilePromise = async (
  file: string,
  args: string[],
): Promise<void> =>
  new Promise((resolve: () => void, reject: (err: Error) => void) => {
    execFile(file, args, (err: Error | null) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
