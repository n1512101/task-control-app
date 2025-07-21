import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";
import dayjs from "dayjs";
import { ITask } from "../../interfaces/task.interface";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import TaskModalCard from "../TaskModalCard/TaskModalCard";
import TaskUpdateDrawer from "../TaskUpdateDrawer/TaskUpdateDrawer";
import "./TaskModal.scss";

// AllTaskページのTaskModal
const TaskModal = ({
  setOpenModal,
  selectedTasks,
  setProperty,
  setTasks,
  onRequestDelete,
  eventDate,
}: {
  setOpenModal: (openModal: boolean) => void;
  selectedTasks: ITask[];
  setProperty: (property: ISnackbarProperty) => void;
  setTasks: Dispatch<SetStateAction<ITask[]>>;
  onRequestDelete: (taskId: string) => void;
  eventDate: string;
}): ReactElement => {
  const [editTargetId, setEditTargetId] = useState<string>("");

  return (
    <div className="task-modal">
      <AnimatePresence>
        {editTargetId && (
          <TaskUpdateDrawer
            key={editTargetId}
            task={
              selectedTasks.find((task) => task._id === editTargetId) || {
                _id: "",
                startDate: dayjs().format("YYYY-MM-DD HH:mm"),
                endDate: dayjs().format("YYYY-MM-DD HH:mm"),
                category: "study",
                description: "",
                status: "pending",
                isAllDay: false,
              }
            }
            setTasks={setTasks}
            setEditTargetId={setEditTargetId}
            setProperty={setProperty}
          />
        )}
      </AnimatePresence>
      <div className="task-modal-container">
        <div className="task-modal-header">
          <button onClick={() => setOpenModal(false)} className="close-button">
            <X size={20} />
          </button>
          <div className="task-modal-header-content">
            <Calendar size={24} />
            <div>
              <h2 className="task-modal-header-title">
                {dayjs(eventDate).format("YYYY年MM月DD日 (ddd)")}
              </h2>
              <p className="task-modal-header-subtitle">
                {selectedTasks.length}件のタスク
              </p>
            </div>
          </div>
        </div>
        <div className="task-modal-body">
          <AnimatePresence>
            {selectedTasks.map((task: ITask) => (
              <TaskModalCard
                key={task._id}
                task={task}
                onRequestDelete={onRequestDelete}
                setEditTargetId={setEditTargetId}
                setTasks={setTasks}
                setProperty={setProperty}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
