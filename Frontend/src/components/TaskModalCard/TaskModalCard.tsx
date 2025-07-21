import { Dispatch, ReactElement, SetStateAction } from "react";
import { CheckCircle2, Circle, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { ITask } from "../../interfaces/task.interface";
import { Category, CategoryBackground, taskVariants } from "../../utils/utils";
import useUpdateTask from "../../hooks/useUpdateTask.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import useDebounce from "../../hooks/useDebounce.hook";
import "./TaskModalCard.scss";

interface IProps {
  task: ITask;
  onRequestDelete: (taskId: string) => void;
  setEditTargetId: (id: string) => void;
  setTasks: Dispatch<SetStateAction<ITask[]>>;
  setProperty: (property: ISnackbarProperty) => void;
}

// TaskModalの各TaskCard
const TaskModalCard = ({
  task,
  // toggleTaskCompletion,
  onRequestDelete,
  setEditTargetId,
  setTasks,
  setProperty,
}: IProps): ReactElement => {
  // データ更新hook
  const { mutate } = useUpdateTask();

  // debounce関数(500ms)
  const debounce = useDebounce(500);
  const debouncedUpdateStatus = (newDone: boolean) => {
    debounce(() => {
      // データベース更新
      mutate(
        {
          path: "/task",
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

  // タスクの完了状態を切り替える関数
  const toggleTaskCompletion = () => {
    const newDone = task.status !== "done";
    // 状態を更新
    setTasks((prev: ITask[]) =>
      prev.map((item) =>
        item._id === task._id
          ? { ...item, status: newDone ? "done" : "pending" }
          : item
      )
    );
    // データベース更新
    debouncedUpdateStatus(newDone);
  };

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
            onClick={toggleTaskCompletion}
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
