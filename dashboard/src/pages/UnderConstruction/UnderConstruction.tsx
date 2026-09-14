import { Anchor, Stack, Title } from "@mantine/core";
import { wikiContainerClass } from "@/foundations";

export const UnderConstruction = () => {
  return (
    <Stack className={wikiContainerClass} py="md">
      <Stack>
        <Title>Authentication</Title>
        <Anchor href="/auth/signup">Sign up</Anchor>
        <Anchor href="/auth/login">Login</Anchor>
        <Anchor href="/auth/email_verification">email verification</Anchor>
        <Anchor href="/auth/forgotten_password">forgotten_password</Anchor>
      </Stack>
      <Stack>
        <Title>Pages</Title>
        <Anchor href="/home">home</Anchor>
        <Anchor href="/search">Search</Anchor>
        <Anchor href="/page/1">wiki page</Anchor>
        <Anchor href="/profile">Profile</Anchor>
        <Anchor href="/notifications">Notifications</Anchor>
      </Stack>
      <Stack>
        <Title>Forms</Title>
        <Anchor href="/onboarding">onboarding</Anchor>
        <Anchor href="/profile/edit">profile edit</Anchor>
        <Anchor href="/page/1/section/1">section form</Anchor>
      </Stack>
    </Stack>
  );
};
