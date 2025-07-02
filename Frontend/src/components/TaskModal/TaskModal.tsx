import { ReactElement } from "react";
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, X } from "lucide-react";
import dayjs from "dayjs";
import { IEventTask } from "../../interfaces/task.interface";
import "./TaskModal.scss";

const TaskModal = ({
  setOpenModal,
  selectedTasks,
}: {
  setOpenModal: (openModal: boolean) => void;
  selectedTasks: IEventTask[];
}): ReactElement => {
  const toggleTaskCompletion = (id: string) => {
    console.log(id);
  };

  const handleEdit = (id: string) => {
    console.log(id);
  };

  const handleDelete = (id: string) => {
    console.log(id);
  };
  return (
    <div className="task-modal">
      <div className="task-modal-container">
        <div className="task-modal-header">
          <button onClick={() => setOpenModal(false)} className="close-button">
            <X size={20} />
          </button>
          <div className="task-modal-header-content">
            <Calendar size={24} />
            <div>
              <h2 className="task-modal-header-title">
                {dayjs(selectedTasks[0].start).format("YYYY年MM月DD日 (ddd)")}
              </h2>
              <p className="task-modal-header-subtitle">
                {selectedTasks.length}件のタスク
              </p>
            </div>
          </div>
        </div>
        <div className="task-modal-body">
          {selectedTasks.map((task: IEventTask) => (
            <div
              key={task.id}
              className={`task-modal-item ${
                task.status === "done" ? "completed" : ""
              }`}
            >
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
                  <div
                    className={`task-modal-title ${
                      task.status === "done" ? "completed" : ""
                    }`}
                  >
                    {task.title}
                  </div>
                </div>
                <div className="task-modal-actions">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="action-button"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="action-button delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
