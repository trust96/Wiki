import { WikiModal } from "@/components/primitive";
import { Login } from "./Login";
import { useTranslation } from "react-i18next";

type TLoginModal = {
  isOpen: boolean;
  handleClose: () => void;
};

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
