import Jimp, { RGBA } from 'jimp';

import { ColorConverter } from '../utils/colorUtils';

/**
 * Bitmap image for pattern.
 */
export class PatternMap {
  /** Column count. */
  public readonly colCount: number;
  /** Row count. */
  public readonly rowCount: number;
  /** Width of pattern. */
  public readonly patternWidth: number;
  /** Height of pattern. */
  public readonly patternHeight: number;
  /** Bitmap width. */
  public readonly width: number;
  /** Bitmap height */
  public readonly height: number;

  private readonly emptyValue: RGBA;
  private readonly data: RGBA[];

  /**
   * Create PatternMap.
   *
   * @param colCount Column count.
   * @param rowCount Row count.
   * @param patternWidth Width of pattern.
   * @param patternHeight Height of pattern.
   * @param emptyValue Fallback color value. For initial, out of bound and illegal coordinate.
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
   * Create PatternMap object from image file.
   *
   * @param filePath
   * @param patternWidth Width of pattern.
   * @param patternHeight Height of pattern.
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
   * Get color from location.
   *
   * @param x
   * @param y
   */
  public getPixel(x: number, y: number): RGBA {
    const index = this.getIndex(x, y);

    return index >= 0 ? { ...this.data[index] } : { ...this.emptyValue };
  }

  /**
   * Set color to location.
   *
   * @param x
   * @param y
   * @param color
   */
  public putPixel(x: number, y: number, color: RGBA): void {
    const index = this.getIndex(x, y);

    if (index >= 0) this.data[index] = { ...color };
  }

  /**
   * Get bitmap pattern.
   *
   * @param col Number of columns.
   * @param row Number of rows.
   * @param start Start offset.
   * @param end End offset.
   * @param converter Callback of color conversion.
   */
  public getPattern(
    col: number,
    row: number,
    start: number,
    end: number,
    converter: ColorConverter<boolean>,
  ): number[] {
    const ox = col * this.patternWidth;
    const oy = row * this.patternHeight;
    const result: number[] = [];

    for (let y = start; y <= end; y += 1) {
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
   * Get colors in area.
   *
   * @param x
   * @param y
   * @param width
   * @param height
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

  /**
   * Get index of location.
   *
   * @param x
   * @param y
   */
  private getIndex(x: number, y: number): number {
    const ix = Number.isFinite(x) ? Math.floor(x) : -1;
    const iy = Number.isFinite(y) ? Math.floor(y) : -1;

    if (ix >= 0 && ix < this.width && iy >= 0 && iy < this.height) {
      return ix + iy * this.width;
    }

    return -1;
  }
}
