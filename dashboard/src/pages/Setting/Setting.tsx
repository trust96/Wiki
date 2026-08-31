import { Button, Group, Stack, Switch, Text } from "@mantine/core";
import { WikiFull } from "@/components/layout";
import { WikiList, WikiListItem } from "@/components/primitive";
import { semanticColor } from "@/theme";

export const Setting = () => {
  const handleDeleteAccount = () => {
    throw new Error("Not implemented yet");
  };
  const handleChangePassword = () => {};

  return (
    <>
      <WikiFull title="Settings">
        <Stack>
          <Text c={"dimmed"}>Manage your account settings</Text>
          <WikiList>
            <WikiListItem>
              <Group justify="space-between">
                <Text fw={"bold"}>Change Password</Text>

                <Button variant="subtle" onClick={handleChangePassword}>
                  Change password
                </Button>
              </Group>
            </WikiListItem>
            <WikiListItem>
              <Group justify="space-between">
                <Text fw={"bold"}>Toggle dark theme</Text>
                <Switch />
              </Group>
            </WikiListItem>
            <WikiListItem>
              <Group justify="space-between">
                <Text fw={"bold"}>Delete account</Text>

                <Button
                  variant="subtle"
                  color={semanticColor.danger}
                  onClick={handleDeleteAccount}
                >
                  Delete account
                </Button>
              </Group>
            </WikiListItem>
          </WikiList>
        </Stack>
      </WikiFull>
    </>
  );
};
