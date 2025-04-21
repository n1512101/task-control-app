import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import App from "./App";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeContextProvider>
      <App />
    </DarkModeContextProvider>
  </StrictMode>
);
