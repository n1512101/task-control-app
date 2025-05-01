import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  FC,
  ReactElement,
} from "react";

type ThemeModeType = "dark" | "light" | null;
export interface DarkModeContextType {
  mode: ThemeModeType;
  toggle: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType>({
  mode: null,
  // ダミー関数。DarkModeContextProviderで本物の関数に置き換わる
  toggle: () => {},
});

// ダークモードorライトモードを保持するcontext
export const DarkModeContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement => {
  const [mode, setMode] = useState<ThemeModeType>(() => {
    const mode = localStorage.getItem("darkMode");
    if (mode === "dark" || mode === "light") {
      return mode;
    }
    return null;
  });

  // modeが変化するとlocalStorageを書き換える
  useEffect(() => {
    if (mode) {
      localStorage.setItem("darkMode", mode);
    }
  }, [mode]);

  // modeを"dark"と"light"に変換させる関数
  const toggle = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    // value: createContext定義時の型と一致しなければならない
    <DarkModeContext.Provider value={{ mode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
};
