/** Emulator wrapper base class. */
export abstract class EmuWrapper {
  /**
   * Initialize emulator.
   *
   * @param filePath file path of emulator executable.
   * @param onClose callback on close emulator.
   */
  public abstract initialize(
    filePath: string,
    onClose: () => void,
  ): Promise<void>;

  /**
   * Close emulator.
   */
  public abstract close(): Promise<void>;

  /**
   * Boot emulator.
   */
  public abstract boot(): Promise<void>;

  /**
   * Run ROM image on emulator.
   *
   * @param filePath file path of ROM image.
   */
  public abstract start(filePath: string): Promise<void>;
}
