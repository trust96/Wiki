import { WikiFull, type TDirection } from "@/components/layout";
import { UserForm } from "../../patterns";

const formId = "onboarding-form";

export const ProfileEdit = () => {
  const confirmProps: TDirection = {
    text: "Complete",
    form: formId,
  };

  return (
    <WikiFull title="Edit Profile" right={confirmProps}>
      <UserForm />
    </WikiFull>
  );
};
