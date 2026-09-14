import { WikiEditor } from "@/components/input";
import { PageComponent } from "@/components/layout";
import { useSinglePage } from "@/hooks/useSinglePage";
import { useRouter } from "@/hooks/useRouter";
import { useUploadMutation } from "@/services/file";
import { useUpdateSectionMutation } from "@/services/page";
import { sectionFormParamsSchema } from "@/services/schema";
import { Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ReasonBanner } from "../patterns";

const formId = "section-form";

export const SectionForm = () => {
  const { t } = useTranslation("dashboard");
  const { id, sectionId } = useParams();
  const [params] = useSearchParams();
  const { push } = useRouter();
  const pageId = Number(id);
  const { data } = useSinglePage(pageId);
  const section = data?.data?.sections.find(
    (item) => String(item.id) === sectionId,
  );
  const { mutateAsync: save } = useUpdateSectionMutation();
  const { mutateAsync: uploadFile } = useUploadMutation();
  const reason = params.get("reason");
  const { setValues, values, onSubmit } = useForm<{ content: string }>({
    initialValues: { content: "" },
    validate: zod4Resolver(sectionFormParamsSchema),
  });

  useEffect(() => {
    if (section?.content) {
      setValues({ content: section.content });
    }
  }, [section?.id]);

  const handleSubmit = onSubmit(async () => {
    if (!section) return;
    const result = await save({
      pageId,
      sectionId: section.id,
      content: values.content,
    });
    if (result.isSuccess) {
      push(`/page/${pageId}`);
    }
  });

  return (
    <PageComponent.Dashboard
      title={t("section.title")}
      description={t("section.title")}
    >
      <form id={formId} onSubmit={handleSubmit}>
        <Stack gap="md">
          {reason ? <ReasonBanner reason={reason} /> : null}
          <WikiEditor
            value={values.content}
            onChange={(content) => setValues({ content })}
            onImageFile={async (file) => {
              const upload = await uploadFile({ files: file });
              return upload.data?.url ?? URL.createObjectURL(file);
            }}
          />
          <Button type="submit">{t("section.save")}</Button>
        </Stack>
      </form>
    </PageComponent.Dashboard>
  );
};
