import { Box, Flex } from "@mantine/core";
import { WikiFooter } from "../Footer";
import { WikiNavigation } from "../Navigation";
import type { TPageComponentSiteProps } from "./types";
import { PageComponentMetaData } from "./PageComponentMetaData";
import { wikiContainerClass } from "@/foundations";

export const PageComponentSite = (props: TPageComponentSiteProps) => {
  return (
    <>
      <PageComponentMetaData
        title={props.title}
        description={props.description}
      />
      <Flex direction="column" h="100%">
        <WikiNavigation.Site />
        <Box
          className={wikiContainerClass}
          flex={1}
          py="lg"
          style={{ overflow: "auto" }}
        >
          {props.children}
        </Box>
        <WikiFooter />
      </Flex>
    </>
  );
};
