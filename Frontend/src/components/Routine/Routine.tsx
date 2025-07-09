import { FC, ReactElement, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import { IRoutineResponse } from "../../interfaces/task.interface";
import TaskCard from "../TaskCard/TaskCard";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import CustomizedModal from "../Modal/Modal";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import useDeleteRoutine from "../../hooks/useDeleteTask.hook";
import SelectCompletedTaskButton from "../SelectCompletedTaskButton/SelectCompletedTaskButton";
import { LoadingContext } from "../../context/LoadingContext";
import AddTaskButton from "../AddTaskButton/AddTaskButton";
import "./Routine.scss";

// 今週のルーティンコンポーネント
const Routine: FC = (): ReactElement => {
  // ローディング状態を管理するcontext
  const { setIsLoading } = useContext(LoadingContext);

  // データ取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetRoutine();
  // タスク削除hook
  const { mutate } = useDeleteRoutine();

  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  const [open, setOpen] = useState(false); // modalが開いているか
  const [weeklyRoutines, setWeeklyRoutines] = useState<IRoutineResponse[]>([]);
  const [dailyRoutines, setDailyRoutines] = useState<IRoutineResponse[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  // 未完了のルーティンのみを表示するかどうか
  const [onlyPending, setOnlyPending] = useState<boolean>(false);

  // 初期データ同期（初回のみ）
  useEffect(() => {
    if (isSuccess) {
      const routines = data.data;
      setWeeklyRoutines(
        routines.filter(
          (routine: IRoutineResponse) => routine.repeatType === "weekly"
        )
      );
      setDailyRoutines(
        routines.filter(
          (routine: IRoutineResponse) => routine.repeatType === "daily"
        )
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
      { path: "/routine", id: deleteTargetId },
      {
        onSuccess: (response) => {
          setWeeklyRoutines(
            weeklyRoutines.filter((task) => task._id !== deleteTargetId)
          );
          setDailyRoutines(
            dailyRoutines.filter((task) => task._id !== deleteTargetId)
          );
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

  const updateRoutineStatus = (
    items: IRoutineResponse[],
    taskId: string,
    newStatus: IRoutineResponse["status"]
  ): IRoutineResponse[] => {
    return items.map((item) =>
      item._id === taskId ? { ...item, status: newStatus } : item
    );
  };

  // weeklyRoutines内の指定する要素のstatusを更新する関数
  const handleUpdateWeeklyRoutineStatus = (
    taskId: string,
    newStatus: IRoutineResponse["status"]
  ) => {
    setWeeklyRoutines((prev) => updateRoutineStatus(prev, taskId, newStatus));
  };

  // dailyRoutines内の指定する要素のstatusを更新する関数
  const handleUpdateDailyRoutineStatus = (
    taskId: string,
    newStatus: IRoutineResponse["status"]
  ) => {
    setDailyRoutines((prev) => updateRoutineStatus(prev, taskId, newStatus));
  };

  return (
    <div className="routine">
      {isError && (
        <div className="error">
          <p>データの取得に失敗しました。</p>
          <p>再読み込みしてください。</p>
          <CustomizedButton onClick={() => refetch()}>再試行</CustomizedButton>
        </div>
      )}
      {isSuccess && (
        <div className="routine-content">
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <CustomizedModal
            open={open}
            closeModal={closeModal}
            handleDelete={handleDelete}
          />
          <AddTaskButton redirectUrl="/home/routine" isFlipped={true} />
          <div className="header">
            <span className="left">
              {dayjs().locale("ja").format("YYYY年MM月DD日 (ddd)")}
            </span>
            <SelectCompletedTaskButton
              onlyPending={onlyPending}
              setOnlyPending={setOnlyPending}
            />
          </div>
          {/* 週ごとのルーティンコンテナ */}
          <div className="routine-container">
            <div className="routine-header">
              <span className="routine-title">毎週のルーティン</span>
            </div>
            <AnimatePresence>
              {weeklyRoutines
                .filter((task) =>
                  onlyPending ? task.status === "pending" : true
                )
                .map((task: IRoutineResponse) => (
                  <TaskCard
                    task={task}
                    key={task._id}
                    setProperty={setProperty}
                    onRequestDelete={openModal}
                    api="/routine"
                    handleUpdateStatus={handleUpdateWeeklyRoutineStatus}
                  />
                ))}
            </AnimatePresence>
          </div>
          {/* 日ごとのルーティンコンテナ */}
          <div className="routine-container">
            <div className="routine-header">
              <span className="routine-title">毎日のルーティン</span>
            </div>
            <AnimatePresence>
              {dailyRoutines
                .filter((task) =>
                  onlyPending ? task.status === "pending" : true
                )
                .map((task: IRoutineResponse) => (
                  <TaskCard
                    task={task}
                    key={task._id}
                    setProperty={setProperty}
                    onRequestDelete={openModal}
                    api="/routine"
                    handleUpdateStatus={handleUpdateDailyRoutineStatus}
                  />
                ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routine;
