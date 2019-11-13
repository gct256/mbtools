export const sortUtils = {
  compare<T>(a: T, b: T): number {
    if (a < b) return -1;

    if (a > b) return 1;

    return 0;
  },
};
