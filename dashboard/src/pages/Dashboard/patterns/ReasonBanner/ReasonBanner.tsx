import { Alert } from "@mantine/core";
import { WikiIcon } from "@/components/primitive";
import { semanticColor } from "@/foundations";

type TReasonBannerProps = {
  reason: string;
};

export const ReasonBanner = ({ reason }: TReasonBannerProps) => {
  return (
    <Alert
      color={semanticColor.danger}
      icon={<WikiIcon name="info" />}
      title="Declined"
    >
      {reason}
    </Alert>
  );
};
