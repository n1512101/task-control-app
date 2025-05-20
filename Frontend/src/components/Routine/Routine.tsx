import { FC, ReactElement, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import { IRoutineResponse } from "../../interfaces/task.interface";
import TaskCard from "../TaskCard/TaskCard";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import CustomizedModal from "../Modal/Modal";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import useDeleteRoutine from "../../hooks/useDeleteTask.hook";
import "./Routine.scss";

// アニメーション設定
const containerVariants = {
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0 },
};

// 今週のルーティンコンポーネント
const Routine: FC = (): ReactElement => {
  // データ取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetRoutine();
  // タスク削除hook
  const { mutate } = useDeleteRoutine();
  const navigate = useNavigate();

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
  const [onlyPending, setOnlyPending] = useState<boolean>(() => {
    try {
      const result = localStorage.getItem("onlyPending");
      return result ? JSON.parse(result).routine ?? false : false;
    } catch {
      return false;
    }
  });

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
          setOpen(false);
          setDeleteTargetId(null);
        },
      }
    );
  };

  // 未完了のルーティンのみを表示するかどうかを切り替える関数
  const handleClick = () => {
    setOnlyPending(!onlyPending);
  };

  return (
    <div className="routine">
      {isPending && <div>読み込み中...</div>}
      {isError && (
        <div className="error">
          <p>データの取得に失敗しました。</p>
          <p>再読み込みしてください。</p>
          <CustomizedButton onClick={() => refetch()}>再試行</CustomizedButton>
        </div>
      )}
      {isSuccess && (
        <div className="content">
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <CustomizedModal
            open={open}
            setOpen={setOpen}
            handleDelete={handleDelete}
          />
          <div className="header">
            <span className="left">
              {dayjs().locale("ja").format("YYYY年MM月DD日 (ddd)")}
            </span>
            <span className="right" onClick={handleClick}>
              {onlyPending ? "全て表示" : "未完了のみ表示"}
            </span>
          </div>
          {/* 週ごとのルーティンコンテナ */}
          <motion.div
            className="routine-container"
            variants={containerVariants}
            animate="visible"
            initial="hidden"
          >
            <div className="routine-header">
              <span className="routine-title">今週のルーティン</span>
              <IconButton color="primary" className="routine-button">
                <AddCircleIcon
                  fontSize="large"
                  onClick={() => navigate("/home/create-task")}
                />
              </IconButton>
            </div>
            <AnimatePresence>
              {weeklyRoutines.map((task: IRoutineResponse) => (
                <TaskCard
                  task={task}
                  key={task._id}
                  setProperty={setProperty}
                  onRequestDelete={openModal}
                  api="/routine"
                />
              ))}
            </AnimatePresence>
          </motion.div>
          {/* 日ごとのルーティンコンテナ */}
          <motion.div
            className="routine-container"
            variants={containerVariants}
            animate="visible"
            initial="hidden"
          >
            <div className="routine-header">
              <span className="routine-title">今日のルーティン</span>
              <IconButton color="primary" className="routine-button">
                <AddCircleIcon
                  fontSize="large"
                  onClick={() => navigate("/home/create-task")}
                />
              </IconButton>
            </div>
            <AnimatePresence>
              {dailyRoutines.map((task: IRoutineResponse) => (
                <TaskCard
                  task={task}
                  key={task._id}
                  setProperty={setProperty}
                  onRequestDelete={openModal}
                  api="/routine"
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Routine;
