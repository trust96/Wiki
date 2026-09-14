import { SearchField } from "@/components/input";
import { PageComponent } from "@/components/layout";
import { usePage } from "@/hooks/usePage";
import { useRouter } from "@/hooks/useRouter";
import type { TGenre } from "@/services/schema";
import { Box, Stack, Table, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { GenreFilters } from "../patterns";
import { WikiSummary } from "../patterns";

export const Search = () => {
  const { t } = useTranslation("dashboard");
  const { push } = useRouter();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [genres, setGenres] = useState<TGenre[]>([]);
  const [limit, setLimit] = useState(6);
  const { data } = usePage();
  const wikis = data?.data ?? [];

  const filtered = useMemo(() => {
    return wikis
      .filter((wiki) => {
        const matchesQuery =
          !query ||
          wiki.title.toLowerCase().includes(query.toLowerCase()) ||
          wiki.description.toLowerCase().includes(query.toLowerCase());
        const matchesGenre = !genres.length || genres.includes(wiki.genre);
        return matchesQuery && matchesGenre;
      })
      .slice()
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [wikis, query, genres]);

  const isIdle = !query && !genres.length;
  const latest = filtered.slice(0, 5);
  const results = filtered.slice(0, limit);

  return (
    <PageComponent.Dashboard
      title={t("search.title")}
      description={t("search.description")}
    >
      <Stack gap="md">
        <Title order={2}>{t("search.title")}</Title>
        <SearchField
          value={query}
          placeholder={t("search.placeholder")}
          onChange={(event) => {
            const next = event.currentTarget.value;
            setQuery(next);
            setParams(next ? { q: next } : {});
            setLimit(6);
          }}
        />
        <GenreFilters value={genres} onChange={setGenres} />
        {isIdle ? (
          <Stack gap="sm">
            <Title order={3}>{t("search.latest")}</Title>
            <Box hiddenFrom="md">
              <Stack gap="sm">
                {latest.map((wiki) => (
                  <WikiSummary
                    key={wiki.id}
                    title={wiki.title}
                    excerpt={wiki.description}
                    genre={wiki.genre}
                    updatedAt={wiki.updatedAt}
                    onClick={() => push(`/page/${wiki.id}`)}
                  />
                ))}
              </Stack>
            </Box>
            <Box visibleFrom="md">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>{t("search.wiki")}</Table.Th>
                    <Table.Th>{t("search.genre")}</Table.Th>
                    <Table.Th>{t("search.updated")}</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {latest.map((wiki) => (
                    <Table.Tr
                      key={wiki.id}
                      onClick={() => push(`/page/${wiki.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <Table.Td>{wiki.title}</Table.Td>
                      <Table.Td>{wiki.genre}</Table.Td>
                      <Table.Td>
                        {new Date(wiki.updatedAt).toLocaleDateString()}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Box>
          </Stack>
        ) : (
          <Stack gap="sm">
            <Title order={3}>{t("search.results")}</Title>
            {results.map((wiki) => (
              <WikiSummary
                key={wiki.id}
                title={wiki.title}
                excerpt={wiki.description}
                genre={wiki.genre}
                updatedAt={wiki.updatedAt}
                onClick={() => push(`/page/${wiki.id}`)}
              />
            ))}
            {results.length < filtered.length ? (
              <Text
                c="dimmed"
                ta="center"
                onClick={() => setLimit((value) => value + 6)}
                style={{ cursor: "pointer" }}
              >
                {t("search.loadingMore")}
              </Text>
            ) : null}
          </Stack>
        )}
      </Stack>
    </PageComponent.Dashboard>
  );
};
