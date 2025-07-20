import { ReactElement } from "react";
import { CheckCircle2, Circle, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ITask } from "../../interfaces/task.interface";
import { Category, CategoryBackground, taskVariants } from "../../utils/utils";
import "./TaskModalCard.scss";

interface IProps {
  task: ITask;
  toggleTaskCompletion: (taskId: string) => void;
  onRequestDelete: (taskId: string) => void;
  setEditTargetId: (id: string) => void;
}

// TaskModalの各TaskCard
const TaskModalCard = ({
  task,
  toggleTaskCompletion,
  onRequestDelete,
  setEditTargetId,
}: IProps): ReactElement => {
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
            onClick={() => toggleTaskCompletion(task._id)}
            className={`completion-button ${
              task.status === "done" && "completed"
            }`}
          >
            {task.status === "done" ? (
              <CheckCircle2 size={20} />
            ) : (
              <Circle size={20} />
            )}
          </button>
          <div
            className={`task-modal-title ${
              task.status === "done" && "completed"
            }`}
          >
            {task.description}
          </div>
        </div>
        <div className="task-modal-actions">
          <button className="action-button">
            <Edit3 size={16} onClick={() => setEditTargetId(task._id)} />
          </button>
          <button
            onClick={() => onRequestDelete(task._id)}
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
