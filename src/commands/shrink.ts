import { readFile, writeFile } from 'fs-extra';

const getSize = (size: string): number => {
  if (/^\d+$/.test(size)) return Number.parseInt(size, 10) * 1024;

  throw new Error(`illegal size: ${size}`);
};

export const shrink = async (
  size: string,
  inputFilePath: string,
  outputFilePath: string,
): Promise<void> => {
  const oldBuffer = await readFile(inputFilePath);
  const realSize = getSize(size);

  // 切り詰め
  const data = [...oldBuffer.slice(0, realSize)];

  // 補間
  for (let i = data.length; i < realSize; i += 1) data.push(0);

  await writeFile(outputFilePath, Buffer.from(data));
};
