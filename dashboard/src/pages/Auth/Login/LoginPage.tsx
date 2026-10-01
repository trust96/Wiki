import { Login } from "./Login";
import { PageComponent } from "@/components/layout";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
  const { t } = useTranslation("login");
  return (
    <PageComponent.Site
      title={t("document.title")}
      description={t("document.description")}
    >
      <Login />
    </PageComponent.Site>
  );
};

export default LoginPage;
