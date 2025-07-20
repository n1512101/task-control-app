import { FC, ReactElement, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { CheckCircle2 } from "lucide-react";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import { IRoutine } from "../../interfaces/task.interface";
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
import RoutineUpdateDrawer from "../RoutineUpdateDrawer/RoutineUpdateDrawer";

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
  const [routines, setRoutines] = useState<IRoutine[]>([]);
  const [editTargetId, setEditTargetId] = useState<string>("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  // 未完了のルーティンのみを表示するかどうか
  const [onlyPending, setOnlyPending] = useState<boolean>(false);

  // 初期データ同期（初回のみ）
  useEffect(() => {
    if (isSuccess) {
      setRoutines(data.data);
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
          setRoutines(
            routines.filter((routine) => routine._id !== deleteTargetId)
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

  // routines内の指定する要素のstatusを更新する関数
  const handleUpdateRoutineStatus = (
    taskId: string,
    newStatus: IRoutine["status"]
  ) => {
    setRoutines((prev) =>
      prev.map((item) =>
        item._id === taskId ? { ...item, status: newStatus } : item
      )
    );
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
        <div>
          <AnimatePresence>
            {editTargetId && (
              <RoutineUpdateDrawer
                key={editTargetId}
                task={
                  routines.find(
                    (routine: IRoutine) => routine._id === editTargetId
                  ) || {
                    _id: "",
                    repeatType: "daily",
                    category: "study",
                    description: "",
                    status: "pending",
                  }
                }
                setRoutines={setRoutines}
                setEditTargetId={setEditTargetId}
                setProperty={setProperty}
              />
            )}
          </AnimatePresence>
          <div className="routine-content">
            <CustomizedSnackBar property={property} handleClose={handleClose} />
            <CustomizedModal
              open={open}
              closeModal={closeModal}
              handleDelete={handleDelete}
            />
            <AddTaskButton redirectUrl="/home/routine" isFlipped={true} />
            <div className="routine-content-header">
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
                <div className="routine-header-icon">
                  <CheckCircle2 size={20} />
                </div>
                <span className="routine-header-title">毎週のルーティン</span>
              </div>
              <div className="routine-list">
                <AnimatePresence>
                  {routines
                    .filter(
                      (routine: IRoutine) => routine.repeatType === "weekly"
                    )
                    .filter((routine: IRoutine) =>
                      onlyPending ? routine.status === "pending" : true
                    )
                    .map((routine: IRoutine) => (
                      <TaskCard
                        task={routine}
                        key={routine._id}
                        setProperty={setProperty}
                        onRequestDelete={openModal}
                        api="/routine"
                        handleUpdateStatus={handleUpdateRoutineStatus}
                        setEditTargetId={setEditTargetId}
                      />
                    ))}
                </AnimatePresence>
              </div>
            </div>
            {/* 日ごとのルーティンコンテナ */}
            <div className="routine-container">
              <div className="routine-header">
                <div className="routine-header-icon">
                  <CheckCircle2 size={20} />
                </div>
                <span className="routine-header-title">毎日のルーティン</span>
              </div>
              <div className="routine-list">
                <AnimatePresence>
                  {routines
                    .filter(
                      (routine: IRoutine) => routine.repeatType === "daily"
                    )
                    .filter((routine: IRoutine) =>
                      onlyPending ? routine.status === "pending" : true
                    )
                    .map((routine: IRoutine) => (
                      <TaskCard
                        task={routine}
                        key={routine._id}
                        setProperty={setProperty}
                        onRequestDelete={openModal}
                        api="/routine"
                        handleUpdateStatus={handleUpdateRoutineStatus}
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

export default Routine;
