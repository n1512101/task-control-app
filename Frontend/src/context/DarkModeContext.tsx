import { createContext, useState, useEffect, ReactNode, FC } from "react";

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

interface DarkModeContextProviderProps {
  children: ReactNode;
}

// プロジェクト全体をダークモード変換できるようにするcontext
export const DarkModeContextProvider: FC<DarkModeContextProviderProps> = ({
  children,
}) => {
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
