import { ChangeEvent, FC, ReactElement, useState } from "react";
import { Button, Checkbox, IconButton, Paper, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  IRoutineResponse,
  ITaskResponse,
} from "../../interfaces/task.interface";
import { Category, CategoryBackground } from "../../utils/utils";
import useUpdateTask from "../../hooks/useUpdateTask.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import { motion } from "framer-motion";
import useDebounce from "../../hooks/useDebounce.hook";
import "./TaskCard.scss";

interface IProps {
  task: IRoutineResponse | ITaskResponse;
  setProperty: (property: ISnackbarProperty) => void;
  onRequestDelete: (taskId: string) => void;
  api: string;
  handleUpdateStatus: (taskId: string, newStatus: "done" | "pending") => void;
}

// アニメーション設定
const taskVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hidden: { opacity: 0, y: 20 },
  exit: { opacity: 0, x: -500, transition: { duration: 0.5 } },
};

const MotionPaper = motion.create(Paper); // Material UIコンポーネントをmotion化

const TaskCard: FC<IProps> = ({
  task,
  setProperty,
  onRequestDelete,
  api,
  handleUpdateStatus,
}): ReactElement => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>(task.description);

  // データ更新hook
  const { mutate } = useUpdateTask();

  // 編集or保存ボタンを押した際に動作する関数
  const handleEdit = () => {
    // 保存ボタンを押した場合、タスク内容を更新する
    if (isEdit) {
      mutate(
        {
          path: api,
          task: { _id: task._id, description: text },
        },
        {
          onError: (error) => {
            setProperty({
              open: true,
              message: error.message,
              severity: "warning",
            });
          },
        }
      );
    }
    setIsEdit(!isEdit);
  };

  // debounce関数(1秒)
  const debounce = useDebounce(1000);
  const debouncedUpdateStatus = (newDone: boolean) => {
    debounce(() => {
      mutate(
        {
          path: api,
          task: {
            _id: task._id,
            status: newDone ? "done" : "pending",
            category: task.category,
          },
        },
        {
          onError: (error) => {
            setProperty({
              open: true,
              message: error.message,
              severity: "warning",
            });
          },
        }
      );
    });
  };

  // checkboxを変更した際に動作する関数
  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    handleUpdateStatus(task._id, checked ? "done" : "pending");
    debouncedUpdateStatus(checked);
  };

  return (
    <MotionPaper
      layout
      elevation={3}
      className="task"
      variants={taskVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      sx={{
        backgroundColor: "var(--paper-background)",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
        borderRadius: "12px",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 },
        borderColor: "#aaa",
      }}
    >
      <span
        className="category"
        style={{
          backgroundColor: CategoryBackground[task.category],
        }}
      >
        {Category[task.category]}
      </span>

      {isEdit ? (
        <TextField
          multiline
          rows={3}
          className="textfield"
          value={text}
          fullWidth
          slotProps={{
            htmlInput: {
              sx: {
                color: "var(--base-color)",
              },
            },
          }}
          onChange={(e) => setText(e.target.value)}
        />
      ) : (
        <p className={`content ${task.status === "done" && "task-completed"}`}>
          {text}
        </p>
      )}

      <div className="controller">
        <Button className="btn" onClick={handleEdit}>
          {isEdit ? "保存" : "編集"}
        </Button>
        <Checkbox onChange={handleCheck} checked={task.status === "done"} />
        <IconButton aria-label="delete" size="medium" className="deletebtn">
          <DeleteIcon onClick={() => onRequestDelete(task._id)} />
        </IconButton>
      </div>
    </MotionPaper>
  );
};

export default TaskCard;
