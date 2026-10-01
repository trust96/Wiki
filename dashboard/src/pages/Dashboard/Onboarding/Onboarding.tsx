import { WikiFull, type TDirection } from "@/components/layout";
import { useTranslation } from "react-i18next";
import { UserForm } from "../patterns";

const formId = "user-form";

export const Onboarding = () => {
  const { t } = useTranslation("dashboard");
  const right: TDirection = {
    text: t("onboarding.complete"),
    form: formId,
  };
  return (
    <WikiFull title={t("onboarding.title")} right={right}>
      <UserForm />
    </WikiFull>
  );
};
