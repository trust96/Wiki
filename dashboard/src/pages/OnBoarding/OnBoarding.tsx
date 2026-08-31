import { WikiFull, type TDirection } from "@/components/layout";
import { UserForm } from "@/components/feature/profile";

const formId = "onboarding-form";

export const OnBoardingForm = (_) => {
  const confirmProps: TDirection = {
    text: "Complete",
    form: formId,
  };
  return (
    <WikiFull title="OnBoarding" right={confirmProps}>
      <UserForm />
    </WikiFull>
  );
};
