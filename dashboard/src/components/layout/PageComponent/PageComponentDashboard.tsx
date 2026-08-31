import { Box, Container, Flex, Paper } from "@mantine/core";
import { WikiBottomNavigation } from "../BottomNavigation";
import { WikiNavigation } from "../Navigation";
import { WikiSidebar } from "../Sidebar";
import type { TPageComponentDashboardProps } from "./PageComponent.model";
import { PageComponentMetaData } from "./PageComponentMetaData";

export const PageComponentDashboard = (props: TPageComponentDashboardProps) => {
  return (
    <Box>
      <PageComponentMetaData
        title={props.title}
        description={props.description}
      />
      <Container>
        <Flex direction="column" h="100dvh" gap="md" py="md">
          <WikiNavigation.Dashboard />
          <Flex flex={1} gap="md" align="stretch" mih={0}>
            <Box visibleFrom="md">
              <WikiSidebar />
            </Box>
            <Paper p="md" flex={1} style={{ overflow: "auto" }}>
              {props.children}
            </Paper>
          </Flex>
          <Box hiddenFrom="md">
            <WikiBottomNavigation />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};
