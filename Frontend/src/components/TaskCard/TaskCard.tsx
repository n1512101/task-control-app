import { FC, ReactElement, useState } from "react";
import { Button, Checkbox, IconButton, Paper, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IRoutineTask } from "../../interfaces/task.interface";
import { Category, CategoryBackground } from "../../utils/utils";
import useUpdateRoutine from "../../hooks/useUpdateRoutine.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import { motion } from "framer-motion";
import useDebounce from "../../hooks/useDebounce.hook";
import "./TaskCard.scss";

interface IProps {
  task: IRoutineTask;
  setProperty: (property: ISnackbarProperty) => void;
  onRequestDelete: (taskId: string) => void;
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
}): ReactElement => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>(task.description);
  const [isDone, setIsDone] = useState<boolean>(
    task.status === "done" ? true : false
  );

  // データ更新hook
  const { mutate } = useUpdateRoutine();

  // 編集or保存ボタンを押した際に動作する関数
  const handleEdit = () => {
    // 保存ボタンを押した場合、タスク内容を更新する
    if (isEdit) {
      mutate(
        { _id: task._id, description: text },
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
  const debouncedUpdate = (newDone: boolean) => {
    debounce(() => {
      mutate(
        { _id: task._id, status: newDone ? "done" : "pending" },
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
  const handleCheck = () => {
    const newDone = !isDone;
    setIsDone(newDone);
    debouncedUpdate(newDone);
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
      }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
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
        <p className="content">{text}</p>
      )}

      <div className="controller">
        <Button className="btn" onClick={handleEdit}>
          {isEdit ? "保存" : "編集"}
        </Button>
        <Checkbox onChange={handleCheck} checked={isDone} />
        <IconButton aria-label="delete" size="medium" className="deletebtn">
          <DeleteIcon onClick={() => onRequestDelete(task._id)} />
        </IconButton>
      </div>
    </MotionPaper>
  );
};

export default TaskCard;
