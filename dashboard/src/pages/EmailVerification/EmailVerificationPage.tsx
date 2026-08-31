import { PageComponent } from "@/components/layout";
import { WikiIcon } from "@/components/primitive";
import { RESEND_EMAIL_DELAY } from "@/helper/constants";
import { PRIMARY_COLOR } from "@/theme";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { resendFormatTime } from "./EmailVerificationPage.util";

const EmailVerificationPage = () => {
  const RESEND_DELAY = RESEND_EMAIL_DELAY * 60;
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { t } = useTranslation("email_verification");

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResend = () => {
    if (secondsLeft !== 0) {
      return;
    }
    //TODO:  add the resend logic
    setSecondsLeft(RESEND_DELAY);
  };

  const buttonLabel =
    secondsLeft !== 0 ? resendFormatTime(secondsLeft) : t("resend_button");

  return (
    <PageComponent.Site
      title={t("document.title")}
      description={t("document.description")}
    >
      <Stack>
        <Group>
          <WikiIcon name="check_circle" size={48} color={PRIMARY_COLOR} />
          <Title order={2} ta={"center"}>
            {t("title")}
          </Title>
        </Group>
        <Text>{t("content")}</Text>
        <Button onClick={handleResend} disabled={secondsLeft !== 0}>
          {buttonLabel}
        </Button>
      </Stack>
    </PageComponent.Site>
  );
};

export default EmailVerificationPage;
