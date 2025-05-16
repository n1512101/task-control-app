import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Home from "../pages/Home/Home";
import RequireAuth from "../components/RequireAuth/RequireAuth";
import Tasks from "../components/Tasks/Tasks";
import WeekRoutine from "../components/WeekRoutine/WeekRoutine";
import AllTasks from "../components/AllTasks/AllTasks";
import CreateTask from "../components/CreateTask/CreateTask";

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
          path: "week-routine",
          element: <WeekRoutine />,
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
