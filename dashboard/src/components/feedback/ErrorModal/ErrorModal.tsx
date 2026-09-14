import { Group, Stack, Text } from "@mantine/core";
import { WikiModal } from "@/components/primitive";
import { WikiIcon } from "@/components/primitive";
import { useUiStore } from "@/state/ui";
import { useTranslation } from "react-i18next";
import { errorMessages, genericErrorMessage } from "./constants";

export const ErrorModal = () => {
  const apiErrors = useUiStore((state) => state.apiErrors);
  const clearApiErrors = useUiStore((state) => state.clearApiErrors);
  const handleClose = () => {
    clearApiErrors();
  };
  const { t } = useTranslation(["errors", "common"]);
  if (!apiErrors.length) {
    return null;
  }
  return (
    <WikiModal
      zIndex={10000}
      title={
        <Group gap="xs" component="span">
          <WikiIcon name="warning" />
          <Text component="span" fw="bold">
            {t("common:attention")}
          </Text>
        </Group>
      }
      centered
      onClose={handleClose}
      opened={true}
      w="600px"
      maw="80vw"
      closeProps={{ label: t("common:button.close") }}
    >
      <Stack>
        {apiErrors?.map((msg, i) => {
          const error =
            (typeof msg.code === "number"
              ? errorMessages[msg.code]
              : undefined) ?? genericErrorMessage;
          return (
            <Stack key={`error${i}${msg.status}`}>
              {msg.status && <Text fw="bold">{msg.status}</Text>}
              <Text dangerouslySetInnerHTML={{ __html: t(error) }} />
            </Stack>
          );
        })}
      </Stack>
    </WikiModal>
  );
};
