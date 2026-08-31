import { SearchField } from "@/components/input";
import { PageComponent } from "@/components/layout";
import { WikiList, WikiListItem } from "@/components/primitive";
import { usePage } from "@/hooks/usePage";
import { useRouter } from "@/hooks/useRouter";
import { primaryShade } from "@/theme";
import { Divider, Stack, Text, Title } from "@mantine/core";
import { useState, type ChangeEvent } from "react";

export const SearchPage = () => {
  const { push } = useRouter();
  const [searchString, setSearchString] = useState("");
  const { data: pages } = usePage();
  const filteredPages = (pages?.data ?? [])?.filter((page) => {
    return page.name.includes(searchString);
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value);
  };

  return (
    <PageComponent.Dashboard title="Search" description="Search the community">
      <Title mb="md">Search the community</Title>
      <SearchField onChange={handleChange} />
      <Divider label="Results" my="md" />
      <WikiList isHoverable>
        {filteredPages?.map((page) => {
          const handleClick = () => {
            push(`/page/${page?.documentId}`);
          };
          return (
            <WikiListItem key={page?.id} onClick={handleClick}>
              <Stack gap={4}>
                <Text size="md" c={primaryShade(5)} fw="bolder">
                  {page?.name}
                </Text>
                <Text size="md" c={primaryShade(5)} fw="bolder">
                  {page?.description}
                </Text>
              </Stack>
            </WikiListItem>
          );
        })}
      </WikiList>
    </PageComponent.Dashboard>
  );
};
