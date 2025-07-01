import { ReactElement } from "react";
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, X } from "lucide-react";
import { IEventTask } from "../../interfaces/task.interface";
import "./TaskModal.scss";

const TaskModal = ({
  setOpenModal,
  selectedTasks,
}: {
  setOpenModal: (openModal: boolean) => void;
  selectedTasks: IEventTask[];
}): ReactElement => {
  const toggleTaskCompletion = (id: string) => {};

  const handleEdit = (id: string) => {};

  const handleDelete = (id: string) => {};

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
              <h2 className="task-modal-header-title">2025年07月01日</h2>
              <p className="task-modal-header-subtitle">
                火曜日 - {selectedTasks.length}件のタスク
              </p>
            </div>
          </div>
        </div>
        <div className="task-modal-body">
          {selectedTasks.map((task: IEventTask) => (
            <div
              key={task.id}
              className={`task-item ${
                task.status === "done" ? "completed" : ""
              }`}
            >
              <div className="task-content">
                <div className="task-left">
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

                  <div className="task-info">
                    <span
                      className={`task-title ${
                        task.status === "done" ? "completed" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                </div>

                <div className="task-actions">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="action-button"
                    title="編集"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="action-button delete"
                    title="削除"
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
