import { WikiEditor } from "@/components/input";
import { PageComponent } from "@/components/layout";
import { useSinglePage } from "@/hooks/useSinglePage";
import { useUploadMutation } from "@/services/file";
import { useUpdateSectionMutation } from "@/services/page";
import { sectionFormParamsSchema } from "@/services/schema";
import { Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useEffect } from "react";
import { useLocation, useParams, useSearchParams } from "wouter";
import { useTranslation } from "react-i18next";
import { ReasonBanner } from "../patterns";

const formId = "section-form";

export const SectionForm = () => {
  const { t } = useTranslation("dashboard");
  const params = useParams<{ id?: string; sectionId?: string }>();
  const id = params.id;
  const sectionId = params.sectionId;
  const [searchParams] = useSearchParams();
  const [, navigate] = useLocation();
  const pageId = Number(id);
  const { data } = useSinglePage(pageId);
  const section = data?.data?.sections.find(
    (item) => String(item.id) === sectionId,
  );
  const { mutateAsync: save } = useUpdateSectionMutation();
  const { mutateAsync: uploadFile } = useUploadMutation();
  const reason = searchParams.get("reason");
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
    if (result.ok) {
      navigate(`/page/${pageId}`);
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
