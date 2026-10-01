import { getLocale } from "@/helper/getLocale";
import { normalizeBaseQuery } from "@/helper/normalizeBaseQuery";
import { useQuery } from "@tanstack/react-query";

type TTranslationRow = {
  key: string;
  value: string;
  locale?: string;
};

export const translationsKey = (locale: string) =>
  ["translations", locale] as const;

export const useTranslationsQuery = () => {
  const locale = getLocale();
  return useQuery({
    queryKey: translationsKey(locale),
    queryFn: async () => {
      const response = await normalizeBaseQuery<TTranslationRow[]>({
        url: `/translations?locale=${locale}`,
        method: "GET",
      });
      const translations = response.data ?? [];
      const normalizedTranslations = translations.reduce(
        (acc, item) => ({ ...acc, [item.key]: item.value }),
        {} as Record<string, string>,
      );

      return {
        data: normalizedTranslations,
        locale: translations[0]?.locale,
      };
    },
  });
};
