import { FC, ReactElement, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CheckCircle2 } from "lucide-react";
import useGetTasks from "../../hooks/useGetTasks.hook";
import { ITask } from "../../interfaces/task.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import CustomizedModal from "../Modal/Modal";
import AddTaskButton from "../AddTaskButton/AddTaskButton";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import TaskCard from "../TaskCard/TaskCard";
import useDeleteTask from "../../hooks/useDeleteTask.hook";
import SelectCompletedTaskButton from "../SelectCompletedTaskButton/SelectCompletedTaskButton";
import { LoadingContext } from "../../context/LoadingContext";
import TaskUpdateDrawer from "../TaskUpdateDrawer/TaskUpdateDrawer";
import "./Tasks.scss";

dayjs.extend(utc);

const Tasks: FC = (): ReactElement => {
  const [tasks, setTasks] = useState<ITask[]>([]);

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
  const [editTargetId, setEditTargetId] = useState<string>("");
  // 未完了のルーティンのみを表示するかどうか
  const [onlyPending, setOnlyPending] = useState<boolean>(false);

  // 初回のみ初期データ同期
  useEffect(() => {
    if (isSuccess) {
      setTasks(
        data.tasks.map((task: ITask) => ({
          ...task,
          startDate: dayjs.utc(task.startDate).format("YYYY-MM-DD HH:mm"),
          endDate: dayjs.utc(task.endDate).format("YYYY-MM-DD HH:mm"),
        }))
      );
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
  const handleUpdateStatus = (taskId: string, newStatus: ITask["status"]) => {
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
        <div>
          <AnimatePresence>
            {editTargetId && (
              <TaskUpdateDrawer
                key={editTargetId}
                task={
                  tasks.find((task) => task._id === editTargetId) || {
                    _id: "",
                    startDate: dayjs().format("YYYY-MM-DD HH:mm"),
                    endDate: dayjs().format("YYYY-MM-DD HH:mm"),
                    category: "study",
                    description: "",
                    status: "pending",
                    isAllDay: false,
                  }
                }
                setTasks={setTasks}
                setEditTargetId={setEditTargetId}
                setProperty={setProperty}
              />
            )}
          </AnimatePresence>
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
                    .map((task: ITask) => (
                      <TaskCard
                        task={task}
                        key={task._id}
                        setProperty={setProperty}
                        onRequestDelete={openModal}
                        api="/task"
                        handleUpdateStatus={handleUpdateStatus}
                        setEditTargetId={setEditTargetId}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
