import { WikiModal } from "@/components/primitive";
import { Login } from "./Login";
import { useTranslation } from "react-i18next";
import type { TLoginModal } from "./Login.model";

export const LoginModal = (props: TLoginModal) => {
  const { t } = useTranslation("login");
  return (
    <WikiModal
      title={t("document.title")}
      onClose={props.handleClose}
      opened={props.isOpen}
      maw={400}
      w={"100%"}
    >
      <Login />
    </WikiModal>
  );
};
