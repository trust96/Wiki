import { Container, Flex } from "@mantine/core";
import { WikiFooter } from "../Footer";
import { WikiNavigation } from "../Navigation";
import type { TPageComponentSiteProps } from "./PageComponent.model";
import { PageComponentMetaData } from "./PageComponentMetaData";

export const PageComponentSite = (props: TPageComponentSiteProps) => {
  return (
    <>
      <PageComponentMetaData
        title={props.title}
        description={props.description}
      />
      <Flex direction="column" h="100%">
        <WikiNavigation.Site />
        <Container flex={1} py="lg" w="100%" style={{ overflow: "auto" }}>
          {props.children}
        </Container>
        <WikiFooter />
      </Flex>
    </>
  );
};
