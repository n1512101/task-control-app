import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DarkModeContextProvider } from "./context/DarkModeContext";
import { AuthContextProvider } from "./context/AuthContext";
import { LoadingContextProvider } from "./context/LoadingContext";
import App from "./App";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoadingContextProvider>
      <AuthContextProvider>
        <DarkModeContextProvider>
          <App />
        </DarkModeContextProvider>
      </AuthContextProvider>
    </LoadingContextProvider>
  </StrictMode>
);
