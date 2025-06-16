import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import RequireAuth from "../components/RequireAuth/RequireAuth";
import Tasks from "../components/Tasks/Tasks";
import Routine from "../components/Routine/Routine";
import AllTasks from "../components/AllTasks/AllTasks";
import CreateTask from "../components/CreateTask/CreateTask";
import Auth from "../pages/Auth/Auth";

// ルートパス設定
const router = createBrowserRouter(
  [
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/home",
      element: (
        <RequireAuth>
          <Home />
        </RequireAuth>
      ),
      children: [
        {
          index: true,
          element: <Tasks />,
        },
        {
          path: "routine",
          element: <Routine />,
        },
        {
          path: "all-tasks",
          element: <AllTasks />,
        },
        {
          path: "create-task",
          element: <CreateTask />,
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

export default router;
