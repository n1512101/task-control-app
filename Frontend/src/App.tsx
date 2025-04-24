import { FC, ReactElement, useContext } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import router from "./router/router.tsx";
import { CssBaseline, Theme } from "@mui/material";
import {
  DarkModeContext,
  DarkModeContextType,
} from "./context/DarkModeContext.tsx";

const App: FC = (): ReactElement => {
  // mode: ダークモードorライトモード
  const { mode } = useContext<DarkModeContextType>(DarkModeContext);

  // モードテーマ：light, dark, デフォルトの色も定義
  const theme: Theme = createTheme({
    palette: {
      mode: mode ?? "light",
      ...(mode === "light"
        ? {
            background: {
              default: "#f1f1f1",
              paper: "#fdf5e6",
            },
            text: {
              primary: "#000000",
            },
          }
        : {
            background: {
              default: "#222222",
              paper: "#404040",
            },
            text: {
              primary: "#dddddd",
            },
          }),
    },
  });

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
