import { PageComponent } from "@/components/layout";
import { useTranslation } from "react-i18next";
import { Profile } from "./Profile";

export const ProfilePage = () => {
  const { t } = useTranslation("profile");
  return (
    <PageComponent.Dashboard
      title={t("document.title")}
      description={t("document.description")}
    >
      <Profile />
    </PageComponent.Dashboard>
  );
};
