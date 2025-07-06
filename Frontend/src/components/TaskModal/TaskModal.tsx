import { Dispatch, ReactElement, SetStateAction, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";
import dayjs from "dayjs";
import { IEventTask } from "../../interfaces/task.interface";
import useUpdateTask from "../../hooks/useUpdateTask.hook";
import useDebounce from "../../hooks/useDebounce.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import TaskModalCard from "../TaskModalCard/TaskModalCard";
import "./TaskModal.scss";

// AllTaskページのTaskModal
const TaskModal = ({
  setOpenModal,
  selectedTasks,
  setSelectedTasks,
  setProperty,
  setTasks,
  onRequestDelete,
}: {
  setOpenModal: (openModal: boolean) => void;
  selectedTasks: IEventTask[];
  setSelectedTasks: Dispatch<SetStateAction<IEventTask[]>>;
  setProperty: (property: ISnackbarProperty) => void;
  setTasks: Dispatch<SetStateAction<IEventTask[]>>;
  onRequestDelete: (taskId: string) => void;
}): ReactElement => {
  // 選択されたイベントの日付を保持する
  const [selectedTasksDate] = useState<string>(
    selectedTasks.length > 0
      ? dayjs(selectedTasks[0].start).format("YYYY年MM月DD日 (ddd)")
      : ""
  );

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

  // 保存ボタンを押した際の処理
  const handleSave = (
    id: string,
    title: string,
    setIsEdit: (isEdit: boolean) => void
  ) => {
    // データベースに編集内容を保存
    mutate(
      {
        path: "/task",
        task: { _id: id, description: title },
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
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, title } : task))
    );
    setIsEdit(false);
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
              <h2 className="task-modal-header-title">{selectedTasksDate}</h2>
              <p className="task-modal-header-subtitle">
                {selectedTasks.length}件のタスク
              </p>
            </div>
          </div>
        </div>
        <div className="task-modal-body">
          <AnimatePresence>
            {selectedTasks.map((task: IEventTask) => (
              <TaskModalCard
                key={task.id}
                task={task}
                toggleTaskCompletion={toggleTaskCompletion}
                handleSave={handleSave}
                onRequestDelete={onRequestDelete}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
