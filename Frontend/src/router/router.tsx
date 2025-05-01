import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Home from "../pages/Home/Home";
import RequireAuth from "../components/RequireAuth/RequireAuth";

// ルートパス設定
const router = createBrowserRouter(
  [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/home/:userId",
      element: (
        <RequireAuth>
          <Home />
        </RequireAuth>
      ),
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
