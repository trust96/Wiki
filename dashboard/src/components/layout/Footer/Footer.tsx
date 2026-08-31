import { Box, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { appName } from "@/helper/constants";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      ta="center"
      py="xs"
      style={{
        borderTop: "1px solid var(--mantine-color-default-border)",
      }}
    >
      <Text c="dimmed" size="sm">
        {t("footer.copyright", {
          date: new Date().getFullYear(),
          company: appName,
        })}
      </Text>
    </Box>
  );
};

export default Footer;
