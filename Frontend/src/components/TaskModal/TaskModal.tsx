import { Dispatch, ReactElement, SetStateAction } from "react";
import { Calendar, CheckCircle2, Circle, Edit3, Trash2, X } from "lucide-react";
import dayjs from "dayjs";
import { IEventTask } from "../../interfaces/task.interface";
import useUpdateTask from "../../hooks/useUpdateTask.hook";
import useDebounce from "../../hooks/useDebounce.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import { Category, CategoryBackground } from "../../utils/utils";
import "./TaskModal.scss";

const TaskModal = ({
  setOpenModal,
  selectedTasks,
  setSelectedTasks,
  setProperty,
}: {
  setOpenModal: (openModal: boolean) => void;
  selectedTasks: IEventTask[];
  setSelectedTasks: Dispatch<SetStateAction<IEventTask[]>>;
  setProperty: (property: ISnackbarProperty) => void;
}): ReactElement => {
  // データ更新hook
  const { mutate } = useUpdateTask();

  // debounced関数(1秒)
  const debounce = useDebounce(1000);
  const debouncedUpdateStatus = (
    id: string,
    newStatus: IEventTask["status"],
    category: IEventTask["category"]
  ) => {
    debounce(() => {
      mutate(
        {
          path: "/task",
          task: {
            _id: id,
            status: newStatus,
            category,
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
  const toggleTaskCompletion = (id: string) => {
    const task = selectedTasks.find((task) => task.id === id)!;
    const newStatus = task.status === "done" ? "pending" : "done";
    const category = task.category;
    // 状態を更新
    setSelectedTasks((prev: IEventTask[]) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
    // データベース更新
    debouncedUpdateStatus(id, newStatus, category);
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
