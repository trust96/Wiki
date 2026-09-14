import { SearchField } from "@/components/input";
import { primaryShade } from "@/foundations";
import { appName } from "@/helper/constants";
import { usePage } from "@/hooks/usePage";
import { useRouter } from "@/hooks/useRouter";
import { useUser } from "@/hooks/useUser";
import type { TGenre } from "@/services/schema";
import { Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GenreFilters } from "../GenreFilters";
import { WikiSummary } from "../WikiSummary";

export const HeroSection = () => {
  const { t } = useTranslation("dashboard");
  const { push } = useRouter();
  const user = useUser();
  const { data } = usePage();
  const [query, setQuery] = useState("");
  const [genres, setGenres] = useState<TGenre[]>([]);
  const wikis = (data?.data ?? [])
    .filter((wiki) => {
      const matchesQuery =
        !query ||
        wiki.title.toLowerCase().includes(query.toLowerCase()) ||
        wiki.description.toLowerCase().includes(query.toLowerCase());
      const matchesGenre = !genres.length || genres.includes(wiki.genre);
      return matchesQuery && matchesGenre;
    })
    .slice(0, 4);

  return (
    <Stack gap="lg" py="md">
      <Stack gap="xs">
        <Title order={1}>
          {t("home.welcome")}{" "}
          <Text component="span" inherit c={primaryShade(2)} fw={800}>
            {appName}
          </Text>
          {user?.artistName ? `, ${user.artistName}` : ""}
        </Title>
        <Text size="lg" c="dimmed">
          {t("home.tagline")}
        </Text>
      </Stack>
      <SearchField
        value={query}
        placeholder={t("search.placeholder")}
        onChange={(event) => setQuery(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            push(`/search?q=${encodeURIComponent(query)}`);
          }
        }}
      />
      <GenreFilters value={genres} onChange={setGenres} />
      <Stack gap="sm">
        {wikis.map((wiki) => (
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
      <Stack gap="xs">
        <Text size="lg" fw={700}>
          {t("home.sponsor")}
        </Text>
        <Text fw={700}>Mike</Text>
      </Stack>
    </Stack>
  );
};
