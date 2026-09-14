import { Badge } from "@mantine/core";
import { semanticColor } from "@/foundations";
import type { TContributionStatus } from "@/services/schema";

const color = {
  approved: semanticColor.success,
  pending: semanticColor.warning,
  declined: semanticColor.danger,
  abandoned: "gray",
} as const;

type TContributionStatusProps = {
  status: TContributionStatus;
};

export const ContributionStatus = ({ status }: TContributionStatusProps) => {
  return (
    <Badge variant="dot" color={color[status]} tt="capitalize">
      {status}
    </Badge>
  );
};
