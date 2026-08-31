import { Group, NavLink, Stack, Text } from "@mantine/core";
import { useLocation } from "react-router";
import { WikiIcon } from "@/components/primitive";

export type TTableOfContentLink = {
  label: string;
  link: string;
  order?: number;
};

type TTableOfContentsProps = {
  links: TTableOfContentLink[];
};

export const TableOfContents = ({ links }: TTableOfContentsProps) => {
  const { hash } = useLocation();
  const active = hash || links[0]?.link;

  return (
    <Stack gap={4}>
      <Group gap="xs" mb="sm">
        <WikiIcon name="list" size="md" />
        <Text fw={600}>Table of contents</Text>
      </Group>
      {links.map((item) => (
        <NavLink
          key={item.link}
          href={item.link}
          label={item.label}
          active={active === item.link}
          pl={item.order}
          variant="subtle"
          color="violet"
        />
      ))}
    </Stack>
  );
};
