import { Stack, Title } from "@mantine/core";
import { wikiContainerClass } from "@/foundations";
import { WikiLink } from "@/components/primitive";

export const UnderConstruction = () => {
  return (
    <Stack className={wikiContainerClass} py="md">
      <Stack>
        <Title>Authentication</Title>
        <WikiLink href="/auth/signup">Sign up</WikiLink>
        <WikiLink href="/auth/login">Login</WikiLink>
        <WikiLink href="/auth/email_verification">email verification</WikiLink>
        <WikiLink href="/auth/forgotten_password">forgotten_password</WikiLink>
      </Stack>
      <Stack>
        <Title>Pages</Title>
        <WikiLink href="/home">home</WikiLink>
        <WikiLink href="/search">Search</WikiLink>
        <WikiLink href="/page/1">wiki page</WikiLink>
        <WikiLink href="/profile">Profile</WikiLink>
        <WikiLink href="/notifications">Notifications</WikiLink>
      </Stack>
      <Stack>
        <Title>Forms</Title>
        <WikiLink href="/onboarding">onboarding</WikiLink>
        <WikiLink href="/profile/edit">profile edit</WikiLink>
        <WikiLink href="/page/1/section/1">section form</WikiLink>
      </Stack>
    </Stack>
  );
};
