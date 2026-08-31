import { Group, Stack, Text } from "@mantine/core";
import { WikiModal } from "@/components/primitive";
import { WikiIcon } from "@/components/primitive";
import { useDispatch, useSelector } from "react-redux";
import type { TRootState } from "@/state/store";
import { clearApiErrors } from "@/state/apiErrorSlice/apiErrorSlice";
import { useTranslation } from "react-i18next";
import { errorMessages, genericErrorMessage } from "./ErrorModal.constant";

export const ErrorModal = () => {
  const dispatch = useDispatch();
  const apiErrors = useSelector((state: TRootState) => state.apiError);
  const handleClose = () => {
    dispatch(clearApiErrors());
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
          const error = errorMessages[msg.code] ?? genericErrorMessage;
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
