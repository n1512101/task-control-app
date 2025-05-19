import { FC, ReactElement, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import "./Tasks.scss";

// アニメーション設定
const containerVariants = {
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0 },
};

const Tasks: FC = (): ReactElement => {
  const [tasks, setTasks] = useState<ITaskResponse[]>([]);

  // タスク取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetTasks();

  const navigate = useNavigate();

  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  const [open, setOpen] = useState(false); // modalが開いているか
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 初期データ同期（初回のみ）
  useEffect(() => {
    if (isSuccess) {
      setTasks(data.data.tasks);
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
    console.log("delete");
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
        <div className="content">
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <CustomizedModal
            open={open}
            setOpen={setOpen}
            handleDelete={handleDelete}
          />
          <div className="date">
            {dayjs().locale("ja").format("YYYY年MM月DD日 (ddd)")}
          </div>
          <motion.div
            className="routine-container"
            variants={containerVariants}
            animate="visible"
            initial="hidden"
          >
            <div className="routine-header">
              <span className="routine-title">今日のタスク</span>
              <IconButton color="primary" className="routine-button">
                <AddCircleIcon
                  fontSize="large"
                  onClick={() => navigate("/home/create-task")}
                />
              </IconButton>
            </div>
            <AnimatePresence>
              {tasks.map((task: ITaskResponse) => (
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

export default Tasks;
