import { PageComponent } from "@/components/layout";
import { WikiIcon } from "@/components/primitive";
import { RESEND_EMAIL_DELAY, tokenKey } from "@/helper/constants";
import { PRIMARY_COLOR } from "@/foundations";
import {
  currentUserKey,
  useResendVerificationMutation,
  useVerifyEmailMutation,
} from "@/services/auth/auth";
import { useUiStore } from "@/state/ui";
import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "wouter";
import { useHistoryState } from "wouter/use-browser-location";
import { resendFormatTime } from "./helper";

const EmailVerification = () => {
  const RESEND_DELAY = RESEND_EMAIL_DELAY * 60;
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { t } = useTranslation("email_verification");
  const params = useParams<{ code?: string }>();
  const code = params.code;
  const historyState = useHistoryState() as { email?: string } | null;
  const email = historyState?.email;
  const addToken = useUiStore((state) => state.addToken);
  const queryClient = useQueryClient();
  const { mutateAsync: verify } = useVerifyEmailMutation();
  const { mutateAsync: resend } = useResendVerificationMutation();

  useEffect(() => {
    if (!code) return;
    const run = async () => {
      const data = await verify({ token: code });
      if (!data.ok || !data.data) return;
      localStorage.setItem(tokenKey, data.data.token);
      addToken(data.data.token);
      queryClient.setQueryData(currentUserKey, {
        ok: true,
        code: null,
        data: { user: data.data.user },
      });
    };
    void run();
  }, [code]);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((seconds) => seconds - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const handleResend = async () => {
    if (secondsLeft !== 0 || !email) {
      return;
    }
    const data = await resend({ email });
    if (!data.ok) return;
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
        <Button onClick={handleResend} disabled={secondsLeft !== 0 || !email}>
          {buttonLabel}
        </Button>
      </Stack>
    </PageComponent.Site>
  );
};

export default EmailVerification;
