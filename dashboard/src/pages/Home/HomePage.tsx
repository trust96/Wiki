import { HeroSection } from "@/components/feature/home";
import { PageComponent } from "@/components/layout";

export const HomePage = () => {
  return (
    <PageComponent.Dashboard title="Home" description="Wiki home">
      <HeroSection />
    </PageComponent.Dashboard>
  );
};
