import { FC, ReactElement, useContext, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/router.tsx";
import {
  DarkModeContext,
  DarkModeContextType,
} from "./context/DarkModeContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App: FC = (): ReactElement => {
  // mode: ダークモードorライトモード
  const { mode } = useContext<DarkModeContextType>(DarkModeContext);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode ?? "light");
  }, [mode]);

  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </QueryClientProvider>
    </div>
  );
};

export default App;
