import { WikiIcon } from "@/components/primitive";
import { Group, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import type { TOtherUserProfileProps } from "./Profile.model";
import { ShareButton } from "@/components/button";
import { appName } from "@/helper/constants";

export const OtherUserProfile = (props: TOtherUserProfileProps) => {
  const {} = props;
  const { t } = useTranslation();
  const followed = false;
  const handleFollow = () => {
    alert("to be implemented");
  };
  const handleUnfollow = () => {
    alert("to be implemented");
  };

  return (
    <Group>
      <Button
        size="sm"
        onClick={followed ? handleUnfollow : handleFollow}
        leftSection={
          followed ? (
            <WikiIcon name="person_check" size={"sm"} />
          ) : (
            <WikiIcon name="person_add" size={"sm"} />
          )
        }
      >
        {followed ? t("Unfollow") : t("Follow")}
      </Button>
      <ShareButton
        variant="outline"
        size="sm"
        shareData={{
          title: appName,
          text: t("profile_share_text"),
          url: location.href,
        }}
        leftSection={<WikiIcon name="share" />}
      >
        {t("Share")}
      </ShareButton>
    </Group>
  );
};
