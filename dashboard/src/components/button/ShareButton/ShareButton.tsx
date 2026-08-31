import { Button, type ButtonProps } from "@mantine/core";
import { useShareLink } from "./useShareLink";

export const ShareButton = (props: ButtonProps & { shareData: ShareData }) => {
  const { shareData, ...rest } = props;
  const { canShare, share } = useShareLink();
  const handleShare = () => {
    share(shareData);
  };
  return (
    <Button {...rest} disabled={!canShare} onClick={handleShare}>
      {props.children}
    </Button>
  );
};
