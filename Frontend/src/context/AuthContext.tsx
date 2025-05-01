import { createContext, FC, ReactNode, ReactElement, useState } from "react";

export interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
});

// access tokenを保持するcontext
export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
