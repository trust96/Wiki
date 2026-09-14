import { WikiFull, type TDirection } from "@/components/layout";
import { UserForm } from "../patterns";

const formId = "onboarding-form";

export const Onboarding = () => {
  const confirmProps: TDirection = {
    text: "Complete",
    form: formId,
  };
  return (
    <WikiFull title="Onboarding" right={confirmProps}>
      <UserForm />
    </WikiFull>
  );
};
