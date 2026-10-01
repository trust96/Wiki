# Login

- The login shall be in a modal component

- There shall be a login form with:

  - Email / Username input - Required
  - Password input - Required

- Login Button
- Forgot password link (it shall redirect to the forgot password page)
- Are you new? Sign Up link (it shall redirect to the sign up page)

- In case of login error, an error message shall be displayed through a toast notification

- There shall be the possibility to login through "google" Button

- If the user is not verified, it shall redirect to the verification page

- If the user is already logged in, or the login is successful:
  - If the user has not completed onboarding, it shall redirect to onboarding
  - Otherwise it shall redirect to the homepage
