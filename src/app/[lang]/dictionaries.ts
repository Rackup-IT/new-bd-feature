import "server-only";

const dictionaries = {
  en: () =>
    import("../../../dictionaries/en.json").then((module) => module.default),
  bn: () =>
    import("../../../dictionaries/bn.json").then((module) => module.default),
};

export const getDictionary = async (locale: "en" | "bn") => {
  if (!locale || !dictionaries[locale]) {
    return dictionaries.en();
  }
  return dictionaries[locale]();
};
export type Dictionary = Awaited<
  ReturnType<(typeof dictionaries)[keyof typeof dictionaries]>
>;
