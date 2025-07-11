import { FC, ReactElement, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { CheckCircle2 } from "lucide-react";
import useGetTasks from "../../hooks/useGetTasks.hook";
import { ITaskResponse } from "../../interfaces/task.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import CustomizedModal from "../Modal/Modal";
import AddTaskButton from "../AddTaskButton/AddTaskButton";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import TaskCard from "../TaskCard/TaskCard";
import useDeleteTask from "../../hooks/useDeleteTask.hook";
import SelectCompletedTaskButton from "../SelectCompletedTaskButton/SelectCompletedTaskButton";
import { LoadingContext } from "../../context/LoadingContext";
import "./Tasks.scss";

const Tasks: FC = (): ReactElement => {
  const [tasks, setTasks] = useState<ITaskResponse[]>([]);

  // ローディング状態を管理するcontext
  const { setIsLoading } = useContext(LoadingContext);

  // タスク取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetTasks();
  // タスク削除hook
  const { mutate } = useDeleteTask();

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

  // 初回のみ初期データ同期
  useEffect(() => {
    if (isSuccess) {
      setTasks(data.tasks);
    }
    // ローディング状態の変更
    setIsLoading(isPending);
  }, [isSuccess, data, isPending, setIsLoading]);

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
          <AddTaskButton redirectUrl="/home" />
          <div className="tasks-content-header">
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
              <div className="tasks-header-icon">
                <CheckCircle2 size={20} />
              </div>
              <span className="tasks-header-title">本日のタスク</span>
            </div>
            <div className="tasks-list">
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
        </div>
      )}
    </div>
  );
};

export default Tasks;
