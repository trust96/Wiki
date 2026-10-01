import { Stack, Title, Button, Text, PasswordInput } from "@mantine/core";
import { PageComponent } from "@/components/layout";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "wouter";
import { z } from "zod";
import { useResetPasswordMutation } from "@/services/auth/auth";
import { resetPasswordInitialValues } from "./helper";
import { changeForgottenPasswordRequestSchema } from "@wiki/api-contracts";

export const ResetPassword = () => {
  const { t } = useTranslation(["new_password", "common"]);
  const params = useParams<{ code?: string }>();
  const token = params.code ?? "";
  const [, navigate] = useLocation();
  const { mutateAsync: reset } = useResetPasswordMutation();
  const schema = changeForgottenPasswordRequestSchema
    .extend({
      confirmPassword: z.string().min(
        1,
        t("common:validation.required", {
          fieldName: t("new_password:confirm_password"),
        }),
      ),
    })
    .refine((values) => values.password === values.confirmPassword, {
      path: ["confirmPassword"],
      message: t("new_password:validation.confirm"),
    });
  const { getInputProps, onSubmit } = useForm<
    typeof resetPasswordInitialValues
  >({
    initialValues: resetPasswordInitialValues,
    validate: zod4Resolver(schema),
  });

  const handleSubmit = onSubmit(async (values) => {
    const data = await reset({
      token,
      password: values.password,
    });
    if (!data.ok) return;
    navigate("~/auth/login");
  });

  return (
    <PageComponent.Site
      title={t("new_password:document.title")}
      description={t("new_password:document.description")}
    >
      <Stack>
        <Title order={2} ta="center">
          {t("new_password:title")}
        </Title>
        <Text ta="center">{t("new_password:content")}</Text>
        <form style={{ width: "100%" }} onSubmit={handleSubmit}>
          <Stack align="center">
            <PasswordInput
              {...getInputProps("password")}
              w="100%"
              autoComplete="new-password"
              label={t("new_password:password")}
            />
            <PasswordInput
              {...getInputProps("confirmPassword")}
              w="100%"
              autoComplete="new-password"
              label={t("new_password:confirm_password")}
            />
            <Button fullWidth type="submit">
              {t("new_password:continue_button")}
            </Button>
          </Stack>
        </form>
      </Stack>
    </PageComponent.Site>
  );
};
