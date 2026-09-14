import { PageComponent } from "@/components/layout";
import { Title } from "@mantine/core";

export const Notifications = () => {
  return (
    <PageComponent.Dashboard
      title="Notifications"
      description="Outcomes of your edits"
    >
      <Title order={2}>Notifications</Title>
    </PageComponent.Dashboard>
  );
};
