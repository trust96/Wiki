import "material-symbols";
import "@mantine/core/styles.css";
import "@/foundations/globals.css";
import { tokenKey } from "@/helper/constants";
import { useCurrentUserQuery } from "@/services/auth/auth";
import { useUiStore } from "@/state/ui";
import { Redirect, Route, Switch } from "wouter";
import EmailVerification from "./pages/Auth/EmailVerification/EmailVerification";
import { ForgottenPassword } from "./pages/Auth/ForgottenPassword/ForgottenPassword";
import LoginPage from "./pages/Auth/Login/LoginPage";
import { ResetPassword } from "./pages/Auth/ResetPassword/ResetPassword";
import SignupPage from "./pages/Auth/Signup/SignupPage";
import { AuthGate, GuestGate } from "./pages/AuthGate";
import { entryRedirect } from "./pages/authPath";
import { Home } from "./pages/Dashboard/Home/Home";
import { Onboarding } from "./pages/Dashboard/Onboarding/Onboarding";
import { ProfileEdit } from "./pages/Dashboard/Profile/Edit/Edit";
import { ProfilePage } from "./pages/Dashboard/Profile/ProfilePage";
import { Search } from "./pages/Dashboard/Search/Search";
import { Notifications } from "./pages/Dashboard/Notifications/Notifications";
import { SectionForm } from "./pages/Dashboard/Section/SectionForm";
import { Wiki } from "./pages/Dashboard/Wiki/Wiki";
import { NotFound } from "./pages/NotFound/NotFound";

const Entry = () => {
  const token = useUiStore((state) => state.token);
  const removeToken = useUiStore((state) => state.removeToken);
  const { data, isPending } = useCurrentUserQuery(Boolean(token));
  const mePending = Boolean(token) && isPending;
  const user = data?.data?.user;
  if (mePending) return null;
  if (token && !user) {
    localStorage.removeItem(tokenKey);
    removeToken();
  }
  const to = entryRedirect(token, user, mePending);
  if (to) return <Redirect to={to} replace />;
  return null;
};

function App() {
  return (
    <Switch>
      <Route path="/" component={Entry} />
      <Route path="/auth" nest>
        <GuestGate>
          <Switch>
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
            <Route
              path="/email_verification/:code?"
              component={EmailVerification}
            />
            <Route path="/forgotten_password" component={ForgottenPassword} />
            <Route path="/new_password/:code" component={ResetPassword} />
          </Switch>
        </GuestGate>
      </Route>
      <Route>
        <AuthGate>
          <Switch>
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/home" component={Home} />
            <Route path="/profile/edit" component={ProfileEdit} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/user/:id" component={ProfilePage} />
            <Route path="/search" component={Search} />
            <Route path="/notifications" component={Notifications} />
            <Route
              path="/page/:id/section/:sectionId"
              component={SectionForm}
            />
            <Route path="/page/:id" component={Wiki} />
            <Route component={NotFound} />
          </Switch>
        </AuthGate>
      </Route>
    </Switch>
  );
}

export default App;
