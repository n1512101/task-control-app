import { FC, ReactElement, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { Box, Button, Modal, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import IconButton from "@mui/material/IconButton";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import { IRoutineTask } from "../../interfaces/task.interface";
import TaskCard from "../TaskCard/TaskCard";
import CustomizedSnackBar from "../SnackBar/SnackBar";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import useDeleteTask from "../../hooks/useDeleteTask.hook";
import "./Routine.scss";

// アニメーション設定
const containerVariants = {
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0 },
};

// 今週のルーティンコンポーネント
const WeekRoutine: FC = (): ReactElement => {
  // データ取得hook
  const { data, isSuccess, isPending, isError, refetch } =
    useGetRoutine("weekly");
  // タスク削除hook
  const { mutate } = useDeleteTask();
  const navigate = useNavigate();

  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  const [open, setOpen] = useState(false); // modalが開いているか
  const [weeklyRoutines, setWeeklyRoutines] = useState<IRoutineTask[]>([]);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 初期データ同期（初回のみ）
  useEffect(() => {
    if (isSuccess) {
      setWeeklyRoutines(data.data);
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
      {isSuccess && data.data.length === 0 ? (
        <p className="no-routine">週ごとのルーティンがありません</p>
      ) : (
        <div className="content">
          <p className="date">
            {dayjs().locale("ja").format("YYYY年MM月DD日 (ddd)")}
          </p>
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <Modal open={open} onClose={() => setOpen(false)}>
            <Box className="modalbox">
              <Typography className="modalmessage">
                タスクを削除しますか？
              </Typography>
              <Button
                variant="contained"
                color="error"
                className="modalbtn"
                onClick={handleDelete}
              >
                削除
              </Button>
              <Button
                variant="contained"
                className="modalbtn"
                onClick={() => setOpen(false)}
              >
                キャンセル
              </Button>
            </Box>
          </Modal>
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
              {weeklyRoutines.map((task: IRoutineTask) => (
                <TaskCard
                  task={task}
                  key={task._id}
                  setProperty={setProperty}
                  onRequestDelete={openModal}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default WeekRoutine;
