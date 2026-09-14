import { Box, Button, Group, Text, Title } from "@mantine/core";
import classes from "./ServerError.module.css";
import { wikiContainerClass } from "@/foundations";

export const ServerError = () => {
  return (
    <div className={classes.root}>
      <Box className={wikiContainerClass}>
        <div className={classes.label}>500</div>
        <Title className={classes.title}>Something bad just happened...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Our servers could not handle your request. Don&apos;t worry, our
          development team was already notified. Try refreshing the page.
        </Text>
        <Group justify="center">
          <Button variant="white" size="md">
            Refresh the page
          </Button>
        </Group>
      </Box>
    </div>
  );
};
