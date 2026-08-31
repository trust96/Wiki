import {
  ActionIcon,
  TextInput,
  type TextInputProps,
  useMantineTheme,
} from "@mantine/core";
import { WikiIcon } from "@/components/primitive";

export const SearchField = (props: TextInputProps) => {
  const theme = useMantineTheme();

  return (
    <TextInput
      radius="xl"
      placeholder="Search for wikis"
      rightSectionWidth={42}
      leftSection={<WikiIcon name="search" size="md" />}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
        >
          <WikiIcon name="arrow_circle_right" size="md" />
        </ActionIcon>
      }
      autoFocus
      {...props}
    />
  );
};
