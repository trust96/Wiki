import { WikiModal } from "@/components/primitive";
import { Signup } from "./Signup";

export const SignupModal = () => {
  const handleClose = () => {};
  return (
    <WikiModal
      title={"Signup"}
      onClose={handleClose}
      opened={false}
      maw={400}
      w={"100%"}
    >
      <Signup />
    </WikiModal>
  );
};
