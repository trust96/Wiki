import { Group, Button } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { WikiIcon } from "@/components/primitive";
import styles from "./Profile.module.css";

export const CurrentUserProfile = () => {
  const { t } = useTranslation();
  const push = useNavigate();
  const handleEditProfileRoute = () => push("/profile/edit");
  const handleLinkRoute = () => push("/profile/link/edit");

  return (
    <Group>
      <Button
        size="compact-sm"
        variant="subtle"
        className={styles["profile-button"]}
        onClick={handleEditProfileRoute}
        leftSection={<WikiIcon name="edit" size={"sm"} />}
      >
        {t("Edit profile")}
      </Button>
      <Group className={styles.wrapper}>
        <Button
          size="compact-sm"
          className={styles["profile-button"]}
          variant="transparent"
          onClick={handleLinkRoute}
          leftSection={<WikiIcon name="link" size={"sm"} />}
        >
          {t("Manage links")}
        </Button>
      </Group>
    </Group>
  );
};
