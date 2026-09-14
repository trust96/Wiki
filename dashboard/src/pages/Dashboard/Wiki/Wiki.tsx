import { PageComponent } from "@/components/layout";
import { PRIMARY_COLOR } from "@/foundations";
import { useSinglePage } from "@/hooks/useSinglePage";
import { Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router";
import { TableOfContents } from "../patterns";

export const Wiki = () => {
  const { id } = useParams();
  const { data: page } = useSinglePage(Number(id));
  const currentPage = page?.data;
  const links = [...(currentPage?.sections ?? [])].map((sec, i) => ({
    label: sec?.title,
    link: `#${i}`,
    order: 4,
  }));

  return (
    <PageComponent.Dashboard title={currentPage?.title} description="Wiki">
      <Stack gap={45}>
        <Stack>
          <Title c={PRIMARY_COLOR} order={2} mb="md">
            {currentPage?.title}
          </Title>
          <TableOfContents links={links} />
        </Stack>
        <Stack>
          {currentPage?.sections?.map((sec, i) => {
            return (
              <div key={sec?.id ?? i}>
                <Title order={4} mb="md" id={`${i}`}>
                  {sec?.title}
                </Title>
                <Text>{sec?.content}</Text>
              </div>
            );
          })}
        </Stack>
      </Stack>
    </PageComponent.Dashboard>
  );
};
