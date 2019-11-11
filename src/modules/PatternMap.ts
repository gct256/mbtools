import Jimp, { RGBA } from 'jimp';

import { ColorConverter } from '../utils/colorUtils';

/**
 * パターンを扱うためのビットマップクラス
 */
export class PatternMap {
  /** 列数 */
  public readonly colCount: number;
  /** 行数 */
  public readonly rowCount: number;
  /** パターンの幅 */
  public readonly patternWidth: number;
  /** パターンの高さ */
  public readonly patternHeight: number;
  /** 画像の幅 */
  public readonly width: number;
  /** 画像の高さ */
  public readonly height: number;

  private readonly emptyValue: RGBA;
  private readonly data: RGBA[];

  /**
   * コンストラクタ
   *
   * @param colCount 列数
   * @param rowCount 行数
   * @param patternWidth パターンの幅
   * @param patternHeight パターンの高さ
   * @param emptyValue 初期値および範囲外の値
   */
  private constructor(
    colCount: number,
    rowCount: number,
    patternWidth: number,
    patternHeight: number,
    emptyValue: RGBA = { r: 0, g: 0, b: 0, a: 255 },
  ) {
    if (
      !Number.isInteger(colCount) ||
      colCount <= 0 ||
      !Number.isInteger(rowCount) ||
      rowCount <= 0 ||
      !Number.isInteger(patternWidth) ||
      patternWidth <= 0 ||
      !Number.isInteger(patternHeight) ||
      patternHeight <= 0
    ) {
      throw new Error('illegal parameter');
    }

    this.colCount = colCount;
    this.rowCount = rowCount;
    this.patternWidth = patternWidth;
    this.patternHeight = patternHeight;
    this.width = colCount * patternWidth;
    this.height = rowCount * patternHeight;
    this.emptyValue = { ...emptyValue };
    this.data = [];

    const count = this.width * this.height;

    for (let i = 0; i < count; i += 1) {
      this.data.push({ ...emptyValue });
    }
  }

  /**
   * 画像を読み込む
   *
   * @param filePath ファイルパス
   * @param patternWidth パターンの幅
   * @param patternHeight パターンの高さ
   */
  public static async createFromFile(
    filePath: string,
    patternWidth = 8,
    patternHeight = 8,
  ): Promise<PatternMap> {
    const image = await Jimp.read(filePath);
    const w = image.getWidth();
    const h = image.getHeight();

    const col = Math.ceil(w / patternWidth);
    const row = Math.ceil(h / patternHeight);

    const patternMap = new PatternMap(col, row, patternWidth, patternHeight);
    const { width, height } = patternMap;

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (x < w && y < h) {
          const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));

          patternMap.putPixel(x, y, pixel);
        } else {
          patternMap.putPixel(x, y, patternMap.emptyValue);
        }
      }
    }

    return patternMap;
  }

  /**
   * 指定ピクセルの値を取得 / 範囲外はemptyValueを返す
   * @param x X座標
   * @param y Y座標
   */
  public getPixel(x: number, y: number): RGBA {
    const index = this.getIndex(x, y);

    return index >= 0 ? { ...this.data[index] } : { ...this.emptyValue };
  }

  /**
   * 指定ピクセルに値を設定
   *
   * @param x X座標
   * @param y Y座標
   * @param color 色
   */
  public putPixel(x: number, y: number, color: RGBA): void {
    const index = this.getIndex(x, y);

    if (index >= 0) this.data[index] = { ...color };
  }

  /**
   * 任意の位置のビットマップパターンを返す
   *
   * @param col 列番号
   * @param row 行番号
   * @param converter 色変換関数
   */
  public getPattern(
    col: number,
    row: number,
    rowStart: number,
    rowEnd: number,
    converter: ColorConverter<boolean>,
  ): number[] {
    const ox = col * this.patternWidth;
    const oy = row * this.patternHeight;
    const result: number[] = [];

    for (let y = rowStart; y <= rowEnd; y += 1) {
      let line = 0;
      for (let x = 0; x < this.patternWidth; x += 1) {
        line *= 2;

        if (converter(this.getPixel(ox + x, oy + y))) line += 1;
      }
      result.push(line);
    }

    return result;
  }

  /**
   * 指定位置・サイズに含まれる色を配列で返す
   *
   * @param x X位置
   * @param y Y位置
   * @param width 幅
   * @param height 高さ
   */
  public getColors(
    x: number,
    y: number,
    width: number,
    height: number,
    converter: ColorConverter<number>,
  ): number[] {
    const colors: number[] = [];

    for (let iy = 0; iy < height; iy += 1) {
      for (let ix = 0; ix < width; ix += 1) {
        colors.push(converter(this.getPixel(x + ix, y + iy)));
      }
    }

    return colors;
  }

  // 指定座標のデータ位置を返す
  private getIndex(x: number, y: number): number {
    const ix = Number.isFinite(x) ? Math.floor(x) : -1;
    const iy = Number.isFinite(y) ? Math.floor(y) : -1;

    if (ix >= 0 && ix < this.width && iy >= 0 && iy < this.height) {
      return ix + iy * this.width;
    }

    return -1;
  }
}
