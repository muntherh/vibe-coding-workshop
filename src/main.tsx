import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted variable fonts (SIL Open Font License) so the deck renders
// identically with no network connection.
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";

import App from "@/App";
import "@/styles/index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container #root was not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
