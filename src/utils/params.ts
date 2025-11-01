export function getSingleParam(
  param: string | string[] | undefined,
  defaultValue: string = ""
): string {
  if (typeof param === "string") return param;
  if (Array.isArray(param)) return param[0];
  return defaultValue;
}
