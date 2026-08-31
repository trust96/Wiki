import { StrictMode } from "react";
import App from "./App.tsx";
import WikiProvider from "./WikiProvider.tsx";
import { ErrorModal, WikiLoader } from "./components/feature/app";

export const Root = () => {
  return (
    <StrictMode>
      <WikiProvider>
        <App />
        <WikiLoader />
        <ErrorModal />
      </WikiProvider>
    </StrictMode>
  );
};
