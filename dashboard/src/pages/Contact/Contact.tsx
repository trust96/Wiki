import { yupResolver } from "mantine-form-yup-resolver";
import {
  Box,
  Button,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  contactInitialValues,
  contactValidationSchema,
} from "./Contact.helper";
import { useForm } from "@mantine/form";
import { typeOptions } from "./Contact.constant";
import { useRouter } from "@/hooks/useRouter";

export const Contact = (_) => {
  const { push } = useRouter();
  const { getInputProps, onSubmit, errors, values } = useForm({
    initialValues: contactInitialValues,
    validate: yupResolver(contactValidationSchema),
  });

  return (
    <Stack>
      <Box>
        <Text c={"dimmed"}>
          Having trouble? No worries just complete the form and we will help you
        </Text>
      </Box>
      <form onSubmit={onSubmit(() => {})}>
        <Stack>
          <Select
            data={typeOptions}
            {...getInputProps("type")}
            label={"Type"}
          />
          <TextInput
            {...getInputProps("subject")}
            label={"Subject"}
          />
          <Textarea
            {...getInputProps("message")}
            label={"Message"}
            rows={5}
          />
        </Stack>
      </form>
      <Button>Send</Button>
    </Stack>
  );
};
