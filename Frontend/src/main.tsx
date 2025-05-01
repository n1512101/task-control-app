import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import { AuthContextProvider } from "./context/AuthContext";
import App from "./App";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContextProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
