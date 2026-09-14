import { Anchor, Container, Stack, Title } from "@mantine/core";

export const UnderConstruction = () => {
  return (
    <Container h={"100vh"} py={"md"}>
      <Stack style={{ margin: "100px auto" }}>
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
          <Anchor href="/profile">Profile page</Anchor>
          <Anchor href="/search">Search</Anchor>
          <Anchor href="/page/mike">wiki page</Anchor>
        </Stack>
        <Stack>
          <Title>Forms</Title>
          <Anchor href="/onboarding">on boarding</Anchor>
          <Anchor href="/home">profile form</Anchor>
          <Anchor href="/profile">Profile form</Anchor>
          <Anchor href="/search">Wiki form</Anchor>
        </Stack>
      </Stack>
    </Container>
  );
};
