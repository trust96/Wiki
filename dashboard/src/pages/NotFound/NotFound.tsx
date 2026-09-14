import { Box, Button, Image, SimpleGrid, Text, Title } from "@mantine/core";
import classes from "./NotFound.module.css";
import { wikiContainerClass } from "@/foundations";
import { useRouter } from "@/hooks/useRouter";

export const NotFound = () => {
  const { back } = useRouter();

  return (
    <Box className={`${wikiContainerClass} ${classes.root}`}>
      <SimpleGrid spacing={{ base: 40, md: 80 }} cols={{ base: 1, md: 2 }}>
        <Image src={"/not_found_page.svg"} className={classes.mobileImage} />
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text c="dimmed" size="lg">
            Page you are trying to open does not exist. You may have mistyped
            the address, or the page has been moved to another URL. If you think
            this is an error contact support.
          </Text>
          <Button
            variant="outline"
            size="md"
            mt="xl"
            onClick={back}
            className={classes.control}
          >
            Get back to previous page
          </Button>
        </div>
        <Image src={"/not_found_page.svg"} className={classes.desktopImage} />
      </SimpleGrid>
    </Box>
  );
};
