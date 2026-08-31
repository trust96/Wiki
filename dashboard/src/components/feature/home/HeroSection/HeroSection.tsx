import { Image, Stack, Text, Title } from "@mantine/core";
import { SearchField } from "@/components/input";
import { appName } from "@/helper/constants";
import { useRouter } from "@/hooks/useRouter";

export const HeroSection = () => {
  const { push } = useRouter();
  const handleSearch = () => {
    push("/search");
  };
  return (
    <Stack gap="md" py="xl">
      <Title order={1}>
        Welcome to{" "}
        <Text component="span" inherit c="violet.2" fw={800}>
          {appName}
        </Text>
      </Title>
      <Text size="lg" c="dimmed">
        The goal is to make it a community based management. Where the community
        is the one providing a safe environment, moderating the content and
        providing new content.
      </Text>
      <SearchField onClick={handleSearch} readOnly />
      <Text size="lg" fw={700}>
        sponsored by:
      </Text>
      <Image src="mike.avif" w={150} alt="sponsor" />
    </Stack>
  );
};
