import { createRoot } from "react-dom/client";
import { Root } from "./Root.tsx";
import "./initializeTranslations.ts";
import { worker } from "./mocks/browser.ts";

await worker.start();

createRoot(document.getElementById("root")!).render(<Root />);
