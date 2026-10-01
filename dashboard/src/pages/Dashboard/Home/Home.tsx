import { PageComponent } from "@/components/layout";
import { HeroSection } from "../patterns";

export const Home = () => {
  return (
    <PageComponent.Dashboard title="Home" description="Wiki home">
      <HeroSection />
    </PageComponent.Dashboard>
  );
};
