import { FC, ReactElement, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import useGetTasks from "../../hooks/useGetTasks.hook";
import { ITaskResponse } from "../../interfaces/task.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import CustomizedModal from "../Modal/Modal";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import TaskCard from "../TaskCard/TaskCard";
import useDeleteTask from "../../hooks/useDeleteTask.hook";
import SelectCompletedTaskButton from "../SelectCompletedTaskButton/SelectCompletedTaskButton";
import "./Tasks.scss";

const Tasks: FC = (): ReactElement => {
  const [tasks, setTasks] = useState<ITaskResponse[]>([]);

  // タスク取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetTasks();
  // タスク削除hook
  const { mutate } = useDeleteTask();
  const navigate = useNavigate();

  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  const [open, setOpen] = useState(false); // タスク削除確認modalが開いているか
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  // 未完了のルーティンのみを表示するかどうか
  const [onlyPending, setOnlyPending] = useState<boolean>(false);

  // 初期データ同期（初回のみ）
  useEffect(() => {
    if (isSuccess) {
      setTasks(data.tasks);
    }
  }, [isSuccess, data]);

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
  };

  // 削除ボタンを押した際に動作する関数
  const openModal = (taskId: string) => {
    setOpen(true);
    setDeleteTargetId(taskId);
  };

  // 削除キャンセルもしくは削除完了後の処理
  const closeModal = () => {
    setOpen(false);
    setDeleteTargetId(null);
  };

  // タスクを削除する際に動作する関数
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    mutate(
      { path: "/task", id: deleteTargetId },
      {
        onSuccess: (response) => {
          setTasks(tasks.filter((task) => task._id !== deleteTargetId));
          setProperty({
            open: true,
            message: response,
            severity: "success",
          });
        },
        onError: (error) => {
          setProperty({
            open: true,
            message: error.message,
            severity: "warning",
          });
        },
        onSettled: () => {
          closeModal();
        },
      }
    );
  };

  // tasks内の指定する要素のstatusを更新する関数
  const handleUpdateStatus = (
    taskId: string,
    newStatus: ITaskResponse["status"]
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="tasks">
      {isPending && <div>読み込み中...</div>}
      {isError && (
        <div className="error">
          <p>データの取得に失敗しました。</p>
          <p>再読み込みしてください。</p>
          <CustomizedButton onClick={() => refetch()}>再試行</CustomizedButton>
        </div>
      )}
      {isSuccess && (
        <div className="tasks-content">
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <CustomizedModal
            open={open}
            closeModal={closeModal}
            handleDelete={handleDelete}
          />
          <div className="header">
            <span className="left">
              {dayjs().locale("ja").format("YYYY年MM月DD日 (ddd)")}
            </span>
            <SelectCompletedTaskButton
              onlyPending={onlyPending}
              setOnlyPending={setOnlyPending}
            />
          </div>
          <div className="tasks-container">
            <div className="tasks-header">
              <span className="tasks-title">今日のタスク</span>
              <IconButton color="primary" className="tasks-button">
                <AddCircleIcon
                  fontSize="large"
                  onClick={() => navigate("/home/create-task")}
                />
              </IconButton>
            </div>
            <AnimatePresence>
              {tasks
                .filter((task) =>
                  onlyPending ? task.status === "pending" : true
                )
                .map((task: ITaskResponse) => (
                  <TaskCard
                    task={task}
                    key={task._id}
                    setProperty={setProperty}
                    onRequestDelete={openModal}
                    api="/task"
                    handleUpdateStatus={handleUpdateStatus}
                  />
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
