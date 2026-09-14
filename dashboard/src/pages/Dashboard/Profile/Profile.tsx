import {
  Avatar,
  Button,
  Divider,
  Group,
  Spoiler,
  Stack,
  Text,
} from "@mantine/core";
import { useUser } from "@/hooks/useUser";
import { useTranslation } from "react-i18next";
import { OtherUserProfile } from "./OtherUserProfile";
import { useParams } from "react-router";
import { CurrentUserProfile } from "./CurrentUserProfile";
import getFormattedText from "@/helper/getFormattedText";
import { ContributionSection } from "./ContributionSection";

export const Profile = () => {
  const { id } = useParams();
  const user = useUser();
  const isCurrentUser = !id || id === user?.id;
  const { t } = useTranslation();
  const bio = user?.bio;
  const fansCount = 12;
  const fanOfCount = 130;

  return (
    <Stack gap={"xl"}>
      <Stack gap={"md"}>
        <Group gap={"lg"}>
          <Avatar src={user?.avatar} size={"lg"} />
          <Stack gap={"sm"}>
            <Text component="div" fw={"bolder"} tt={"capitalize"} lh={1}>
              {user?.nickname}
            </Text>
            <Group gap={"md"}>
              <Stack gap={"xs"} align="start">
                <Text size="xs" fw={"bold"} tt={"capitalize"} lh={1}>
                  {t("fans")}
                </Text>
                <Button variant="transparent" size="sm" radius={"sm"} lh={1}>
                  {fansCount}
                </Button>
              </Stack>
              <Stack gap={"xs"} align="start">
                <Text size="xs" fw={"bold"} tt={"capitalize"} lh={1}>
                  {t("fan of")}
                </Text>
                <Button variant="transparent" size="sm" radius={"sm"} lh={1}>
                  {fanOfCount}
                </Button>
              </Stack>
            </Group>
          </Stack>
        </Group>

        <Spoiler
          hideLabel={
            <Text fw={"bold"} size="xs">
              hide
            </Text>
          }
          showLabel={
            <Text fw={"bold"} size="xs">
              show more
            </Text>
          }
        >
          <Text
            lh={1.2}
            fw={"normal"}
            size="sm"
            dangerouslySetInnerHTML={{ __html: getFormattedText(bio) }}
          />
        </Spoiler>
        {isCurrentUser ? <CurrentUserProfile /> : <OtherUserProfile />}
      </Stack>
      <Divider />
      <ContributionSection />
    </Stack>
  );
};
