import { WikiFull, type TDirection } from "@/components/layout";
import { UserForm } from "@/components/feature/profile";

const formId = "onboarding-form";

export const ProfileForm = (_) => {
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
