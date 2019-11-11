declare module 'executable' {
  function executable(filePath: string): Promise<boolean>;
  // namespace executable {}
  export = executable;
}
