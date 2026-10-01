import { WikiFull, type TDirection } from "@/components/layout";
import { useTranslation } from "react-i18next";
import { UserForm } from "../../patterns";

const formId = "user-form";

export const ProfileEdit = () => {
  const { t } = useTranslation("dashboard");
  const right: TDirection = {
    text: t("onboarding.complete"),
    form: formId,
  };

  return (
    <WikiFull title={t("profile.edit")} right={right}>
      <UserForm nextPath="/profile" />
    </WikiFull>
  );
};
