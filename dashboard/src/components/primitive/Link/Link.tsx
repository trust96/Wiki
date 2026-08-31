import { Anchor } from "@mantine/core";
import { Link as RouterLink } from "react-router";
import type { TLinkProps } from "./Link.model";

const WikiLink = ({ href, children, ...rest }: TLinkProps) => {
  return (
    <Anchor component={RouterLink} to={href} {...rest}>
      {children}
    </Anchor>
  );
};

export default WikiLink;
