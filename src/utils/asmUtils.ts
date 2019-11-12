/* eslint-disable no-bitwise */

const TAB = '\t';

/** Utilities of assembler. */
export const asmUtils = {
  /**
   * Build assembler comment.
   *
   * @param comment
   */
  comment(comment: string): string {
    return `\t; ${comment}`;
  },

  /**
   * Convert number to binary string.
   *
   * @param value
   * @param bitWidth Bit width.
   */
  toBinString(value: number, bitWidth = 8): string {
    const mask = (1 << bitWidth) - 1;

    return (value & mask).toString(2).padStart(bitWidth, '0');
  },

  /**
   * Convert number to HEX string.
   *
   * @param value
   * @param size Width.
   */
  toHexString(value: number, size = 2): string {
    const mask = (1 << (size * 4)) - 1;

    return (value & mask).toString(16).padStart(size, '0');
  },

  /**
   * Build DB directive using binary string.
   *
   * @param values
   */
  toDb2(...values: number[]): string[] {
    return values.map((v) => `${TAB}db ${asmUtils.toBinString(v)}b`);
  },

  /**
   * Build DB directive using HEX string.
   *
   * @param values
   */
  toDb(...values: number[]): string {
    return `${TAB}db ${values
      .map((x: number) => `$${asmUtils.toHexString(x)}`)
      .join(',')}`;
  },

  /**
   * Build multi row DB directive using HEX string.
   *
   * @param values
   */
  toDbRows(countPerRow: number, ...values: number[]): string[] {
    const { length } = values;
    const result: string[] = [];

    for (let i = 0; i < length; i += countPerRow) {
      result.push(asmUtils.toDb(...values.slice(i, i + countPerRow)));
    }

    return result;
  },

  /**
   *  Build DB directive from string.
   *
   * @param value
   */
  toDbString(value: string): string {
    return `${TAB}db '${value.replace(/'/g, "''")}'`;
  },

  /**
   * Build DB directive using HEX string.
   *
   * @param values
   */
  toDw(...values: number[]): string {
    return `${TAB}dw ${values
      .map((x: number) => `$${asmUtils.toHexString(x, 4)}`)
      .join(',')}`;
  },

  /**
   * Build multi row DW directive using HEX string.
   *
   * @param values
   */
  toDwRows(countPerRow: number, ...values: number[]): string[] {
    const { length } = values;
    const result: string[] = [];

    for (let i = 0; i < length; i += countPerRow) {
      result.push(asmUtils.toDw(...values.slice(i, i + countPerRow)));
    }

    return result;
  },
};
