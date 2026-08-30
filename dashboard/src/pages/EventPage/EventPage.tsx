import { WikiFull } from "@/components/Full";
import { Stack, Text, Title } from "@mantine/core";
import { TableOfContents } from "@/components/TableOfContent/TableOfContent";

export const EventPage = () => {
  const currentPage = null;
  const links = [...(currentPage?.sections ?? [])].map((sec, i) => ({
    label: sec?.title,
    link: `#${i}`,
    order: 4,
  }));

  return (
    <WikiFull>
      <Stack gap={45}>
        <Stack>
          <Title c="violet" order={2} mb={"md"}>
            {currentPage?.name}
          </Title>
          <TableOfContents links={links} />
        </Stack>
        <Stack>
          {currentPage?.sections?.map((sec, i) => {
            return (
              <div>
                <Title order={4} mb={"md"} id={`${i}`}>
                  {sec?.title}
                </Title>
                <Text>{sec?.content}</Text>
              </div>
            );
          })}
        </Stack>
      </Stack>
    </WikiFull>
  );
};
