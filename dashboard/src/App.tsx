import "material-symbols";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "@/foundations/globals.css";
import { Route, Routes } from "react-router";
import EmailVerification from "./pages/Auth/EmailVerification/EmailVerification";
import { ForgottenPassword } from "./pages/Auth/ForgottenPassword/ForgottenPassword";
import LoginPage from "./pages/Auth/Login/LoginPage";
import SignupPage from "./pages/Auth/Signup/SignupPage";
import { Home } from "./pages/Dashboard/Home/Home";
import { Onboarding } from "./pages/Dashboard/Onboarding/Onboarding";
import { ProfileEdit } from "./pages/Dashboard/Profile/Edit/Edit";
import { ProfilePage } from "./pages/Dashboard/Profile/ProfilePage";
import { Search } from "./pages/Dashboard/Search/Search";
import { Wiki } from "./pages/Dashboard/Wiki/Wiki";
import { Notifications } from "./pages/Dashboard/Notifications/Notifications";
import { NotFound } from "./pages/NotFound/NotFound";
import { UnderConstruction } from "./pages/UnderConstruction/UnderConstruction";

function App() {
  return (
    <Routes>
      <Route index path="/" element={<UnderConstruction />} />
      <Route path="auth">
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="email_verification" element={<EmailVerification />} />
        <Route path="forgotten_password" element={<ForgottenPassword />} />
      </Route>
      <Route>
        <Route path="onboarding" element={<Onboarding />} />
        <Route index path="home" element={<Home />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="user/:id" element={<ProfilePage />} />
        <Route path="search" element={<Search />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="page/:id" element={<Wiki />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
