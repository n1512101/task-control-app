import { createContext, FC, ReactElement, ReactNode, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

export interface LoadingContextType {
  setIsLoading: (isLoading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType>(
  {} as LoadingContextType
);

// ローディング画面表示用のcontext
export const LoadingContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider value={{ setIsLoading }}>
      {isLoading && <LoadingSpinner />}
      {children}
    </LoadingContext.Provider>
  );
};
