/**
 * Replace all.
 *
 * @param value
 * @param search
 * @param replace
 */
export const replaceAll = (
  value: string,
  search: string,
  replace: string,
): string => {
  return value.split(search).join(replace);
};
