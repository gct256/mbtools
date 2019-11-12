import { readFile, writeFile } from 'fs-extra';

/**
 * KB --> byte
 *
 * @param size size (KB)
 */
const kbToByte = (size: string): number => {
  if (/^\d+$/.test(size)) return Number.parseInt(size, 10) * 1024;

  throw new Error(`illegal size: ${size}`);
};

/**
 * Implementaion of CLI Command: shrink
 *
 * @param size shrink size (KB)
 * @param inputFilePath input file path.
 * @param outputFilePath output file path.
 */
export const shrink = async (
  size: string,
  inputFilePath: string,
  outputFilePath: string,
): Promise<void> => {
  const oldBuffer = await readFile(inputFilePath);
  const realSize = kbToByte(size);

  // shrink
  const data = [...oldBuffer.slice(0, realSize)];

  // padding
  for (let i = data.length; i < realSize; i += 1) data.push(0);

  await writeFile(outputFilePath, Buffer.from(data));
};
