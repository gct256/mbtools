export abstract class EmuWrapper {
  public abstract initialize(
    filePath: string,
    onClose: () => void,
  ): Promise<void>;

  public abstract close(): Promise<void>;
  public abstract boot(): Promise<void>;
  public abstract start(filePath: string): Promise<void>;
}
