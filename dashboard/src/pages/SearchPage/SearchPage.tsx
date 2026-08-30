import { SearchComponent } from "@/components/HeroSection/SearchComponent";
import WikiList from "@/components/List/List";
import WikiListItem from "@/components/List/ListItem";
import { Divider, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";

import { useRouter } from "@/hooks/useRouter";
export const SearchPage = () => {
  const { push } = useRouter();
  const [searchString, setSearchString] = useState("");
  const pages = [];
  const filteredPages = pages?.filter((page) => {
    return page.name.includes(searchString);
  });

  const handleChange = (e) => {
    setSearchString(e.target.value);
  };

  return (
    <>
      <Title mb={"md"}>Search the community</Title>
      <SearchComponent onChange={handleChange} />
      <Divider label="Results" my={"md"} />
      <WikiList isHoverable>
        {filteredPages?.map((page) => {
          const handleClick = () => {
            push(`/page/${page?.documentId}`);
          };
          return (
            <WikiListItem key={page?.id} handleClick={handleClick}>
              <Stack gap={4}>
                <Text size="md" c={"violet.5"} fw={"bolder"}>
                  {page?.name}
                </Text>
                <Text size="md" c={"violet.5"} fw={"bolder"}>
                  {page?.description}
                </Text>
              </Stack>
            </WikiListItem>
          );
        })}
      </WikiList>
    </>
  );
};
