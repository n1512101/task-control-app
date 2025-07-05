import { ReactElement, useState } from "react";
import { CheckCircle2, Circle, Edit3, Trash2, FileCheck } from "lucide-react";
import { TextField } from "@mui/material";
import { motion } from "framer-motion";
import { IEventTask } from "../../interfaces/task.interface";
import { Category, CategoryBackground, taskVariants } from "../../utils/utils";
import "./TaskModalCard.scss";

interface IProps {
  task: IEventTask;
  toggleTaskCompletion: (taskId: string) => void;
  handleSave: (
    id: string,
    title: string,
    setIsEdit: (isEdit: boolean) => void
  ) => void;
  onRequestDelete: (taskId: string) => void;
}

// TaskModalの各TaskCard
const TaskModalCard = ({
  task,
  toggleTaskCompletion,
  handleSave,
  onRequestDelete,
}: IProps): ReactElement => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task.title);

  return (
    <motion.div
      className={`task-modal-item ${task.status === "done" ? "completed" : ""}`}
      layout
      variants={taskVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <span
        className="task-modal-category"
        style={{
          backgroundColor: CategoryBackground[task.category],
        }}
      >
        {Category[task.category]}
      </span>
      <div className="task-modal-content">
        <div className="task-modal-left">
          <button
            onClick={() => toggleTaskCompletion(task.id)}
            className={`completion-button ${
              task.status === "done" ? "completed" : ""
            }`}
          >
            {task.status === "done" ? (
              <CheckCircle2 size={20} />
            ) : (
              <Circle size={20} />
            )}
          </button>
          {isEdit ? (
            <TextField
              multiline
              rows={2}
              value={title}
              fullWidth
              slotProps={{
                htmlInput: {
                  sx: {
                    color: "var(--base-color)",
                  },
                },
              }}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            <div
              className={`task-modal-title ${
                task.status === "done" ? "completed" : ""
              }`}
            >
              {title}
            </div>
          )}
        </div>
        <div className="task-modal-actions">
          {isEdit ? (
            <button
              onClick={() => handleSave(task.id, title, setIsEdit)}
              className="action-button"
            >
              <FileCheck size={16} />
            </button>
          ) : (
            <button onClick={() => setIsEdit(true)} className="action-button">
              <Edit3 size={16} />
            </button>
          )}
          <button
            onClick={() => onRequestDelete(task.id)}
            className="action-button delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskModalCard;
