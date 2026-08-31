import { WikiModal } from "@/components/primitive";
import { ChangePassword } from "./ChangePassword";

export const ChangePasswordModal = () => {
  const handleClose = () => {};
  return (
    <WikiModal
      title={"Change password"}
      onClose={handleClose}
      opened={false}
      maw={400}
      w={"100%"}
    >
      <ChangePassword />
    </WikiModal>
  );
};
