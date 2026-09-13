/**
 *
 * Transforms a plain search string into fuzzy search where filters using matching operators
 */
const fuzzySearch = (field: string, search?: string) => {
  if (!search || !search.length) return {};

  // Trim spaces and split into an array of words
  const words = search.replace(/\s+/g, " ").trim().split(" ");

  /**
   * Use the % operator to wrap the first and last words
   * More info: https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting#how-does-filtering-work-at-the-database-level
   */
  const startsWith = `%${words[0]}%`;
  const endsWith = words.length > 1 ? `%${words[words.length - 1]}%` : undefined;

  /**
   * Use the <-> operator in the middle words, this ensures that the words are somewhere in the searched string also checking the words order
   * More info: https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search#querying-the-database
   */
  const middleWords = words.filter((word, i) => i !== 0 && i !== words.length - 1).join(" <-> ");

  const filters = {
    AND: [
      {
        [field]: middleWords.length
          ? {
              search: middleWords,
            }
          : {},
      },
      {
        [field]: startsWith.length
          ? {
              startsWith,
              mode: "insensitive",
            }
          : {},
      },
      {
        [field]: endsWith?.length
          ? {
              endsWith,
              mode: "insensitive",
            }
          : {},
      },
    ],
  };

  return filters;
};

export default fuzzySearch;
