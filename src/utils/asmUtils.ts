/* eslint-disable no-bitwise */

const TAB = '\t';

export const asmUtils = {
  /**
   * コメント
   *
   * @param comment コメント
   */
  comment(comment: string): string {
    return `\t; ${comment}`;
  },

  /**
   * 2進数文字列に変換
   * 幅に合わせて AND で調整される
   *
   * @param value 値
   * @param size 幅
   */
  toBinString(value: number, size = 8): string {
    const mask = (1 << 8) - 1;

    return (value & mask).toString(2).padStart(size, '0');
  },

  /**
   * 16進数文字列に変換
   * 幅に合わせて AND で調整される
   *
   * @param value 値
   * @param size 幅
   */
  toHexString(value: number, size = 2): string {
    const mask = (1 << (size * 4)) - 1;

    return (value & mask).toString(16).padStart(size, '0');
  },

  /**
   * 数値を２進数での DB 疑似命令に変換
   *
   * @param values 値
   */
  toDb2(...values: number[]): string[] {
    return values.map((v) => `${TAB}db ${asmUtils.toBinString(v)}b`);
  },

  /**
   * 数値を DB 疑似命令に変換
   *
   * @param values 値
   */
  toDb(...values: number[]): string {
    return `${TAB}db ${values
      .map((x: number) => `$${asmUtils.toHexString(x)}`)
      .join(',')}`;
  },

  /**
   * 数値を複数行の DB 疑似命令に変換
   *
   * @param values 値
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
   *  文字列を DB 疑似命令に変換
   *
   * @param value 値
   */
  toDbString(value: string): string {
    return `${TAB}db '${value.replace(/'/g, "''")}'`;
  },

  /**
   * 数値を DW 疑似命令に変換
   *
   * @param values 値
   */
  toDw(...values: number[]): string {
    return `${TAB}dw ${values
      .map((x: number) => `$${asmUtils.toHexString(x, 4)}`)
      .join(',')}`;
  },

  /**
   * 数値を複数行の DW 疑似命令に変換
   *
   * @param values 値
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
