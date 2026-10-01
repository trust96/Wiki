import { Signup } from "./Signup";
import { useTranslation } from "react-i18next";
import { PageComponent } from "@/components/layout";

const SignupPage = () => {
  const { t } = useTranslation("signup");

  return (
    <PageComponent.Site
      title={t("document.title")}
      description={t("document.description")}
    >
      <Signup />
    </PageComponent.Site>
  );
};

export default SignupPage;
