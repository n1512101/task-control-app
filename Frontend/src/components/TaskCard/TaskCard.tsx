// import { FC, ReactElement, useState } from "react";
// import { TextField } from "@mui/material";
// import { CheckCircle2, Circle, Edit3, FileCheck, Trash2 } from "lucide-react";
// import {
//   IRoutineResponse,
//   ITaskResponse,
// } from "../../interfaces/task.interface";
// import { Category, CategoryBackground, taskVariants } from "../../utils/utils";
// import useUpdateTask from "../../hooks/useUpdateTask.hook";
// import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
// import { motion } from "framer-motion";
// import useDebounce from "../../hooks/useDebounce.hook";
// import "./TaskCard.scss";

// interface IProps {
//   task: IRoutineResponse | ITaskResponse;
//   setProperty: (property: ISnackbarProperty) => void;
//   onRequestDelete: (taskId: string) => void;
//   api: string;
//   handleUpdateStatus: (taskId: string, newStatus: "done" | "pending") => void;
// }

// const TaskCard: FC<IProps> = ({
//   task,
//   setProperty,
//   onRequestDelete,
//   api,
//   handleUpdateStatus,
// }): ReactElement => {
//   const [isEdit, setIsEdit] = useState<boolean>(false);
//   const [text, setText] = useState<string>(task.description);

//   // データ更新hook
//   const { mutate } = useUpdateTask();

//   // 編集or保存ボタンを押した際に動作する関数
//   const handleEdit = () => {
//     // 保存ボタンを押した場合、タスク内容を更新する
//     if (isEdit) {
//       mutate(
//         {
//           path: api,
//           task: { _id: task._id, description: text },
//         },
//         {
//           onError: (error) => {
//             setProperty({
//               open: true,
//               message: error.message,
//               severity: "warning",
//             });
//           },
//         }
//       );
//     }
//     setIsEdit(!isEdit);
//   };

//   // debounce関数(1秒)
//   const debounce = useDebounce(1000);
//   const debouncedUpdateStatus = (newDone: boolean) => {
//     debounce(() => {
//       mutate(
//         {
//           path: api,
//           task: {
//             _id: task._id,
//             status: newDone ? "done" : "pending",
//             category: task.category,
//           },
//         },
//         {
//           onError: (error) => {
//             setProperty({
//               open: true,
//               message: error.message,
//               severity: "warning",
//             });
//           },
//         }
//       );
//     });
//   };

//   // checkboxを変更した際に動作する関数
//   const toggleTaskCompletion = () => {
//     const newDone = task.status !== "done";
//     handleUpdateStatus(task._id, newDone ? "done" : "pending");
//     debouncedUpdateStatus(newDone);
//   };

//   return (
//     <motion.div
//       layout
//       className={`task-card ${task.status === "done" && "completed"}`}
//       variants={taskVariants}
//       initial="initial"
//       animate="visible"
//       exit="exit"
//     >
//       <span
//         className="task-category"
//         style={{
//           backgroundColor: CategoryBackground[task.category],
//         }}
//       >
//         {Category[task.category]}
//       </span>
//       <div className="task-content">
//         <div className="task-content-left">
//           <button
//             onClick={toggleTaskCompletion}
//             className={`completion-button ${
//               task.status === "done" && "completed"
//             }`}
//           >
//             {task.status === "done" ? (
//               <CheckCircle2 size={20} />
//             ) : (
//               <Circle size={20} />
//             )}
//           </button>
//           {isEdit ? (
//             <TextField
//               multiline
//               rows={3}
//               value={text}
//               fullWidth
//               slotProps={{
//                 htmlInput: {
//                   sx: {
//                     color: "var(--base-color)",
//                   },
//                 },
//               }}
//               onChange={(e) => setText(e.target.value)}
//             />
//           ) : (
//             <div
//               className={`task-title ${task.status === "done" && "completed"}`}
//             >
//               {text}
//             </div>
//           )}
//         </div>
//         <div className="task-actions">
//           {isEdit ? (
//             <button onClick={handleEdit} className="action-button">
//               <FileCheck size={16} />
//             </button>
//           ) : (
//             <button onClick={() => setIsEdit(true)} className="action-button">
//               <Edit3 size={16} />
//             </button>
//           )}
//           <button
//             onClick={() => onRequestDelete(task._id)}
//             className="action-button delete"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default TaskCard;

import { FC, ReactElement, useState } from "react";
import { TextField } from "@mui/material";
import { CheckCircle2, Circle, Edit3, FileCheck, Trash2 } from "lucide-react";
import {
  IRoutineResponse,
  ITaskResponse,
} from "../../interfaces/task.interface";
import { Category, CategoryBackground, taskVariants } from "../../utils/utils";
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
  setEditTargetId: (id: string) => void;
}

const TaskCard: FC<IProps> = ({
  task,
  setProperty,
  onRequestDelete,
  api,
  handleUpdateStatus,
  setEditTargetId,
}): ReactElement => {
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>(task.description);

  // データ更新hook
  const { mutate } = useUpdateTask();

  // // 編集or保存ボタンを押した際に動作する関数
  // const handleEdit = () => {
  //   // 保存ボタンを押した場合、タスク内容を更新する
  //   if (isEdit) {
  //     mutate(
  //       {
  //         path: api,
  //         task: { _id: task._id, description: text },
  //       },
  //       {
  //         onError: (error) => {
  //           setProperty({
  //             open: true,
  //             message: error.message,
  //             severity: "warning",
  //           });
  //         },
  //       }
  //     );
  //   }
  //   setIsEdit(!isEdit);
  // };

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
  const toggleTaskCompletion = () => {
    const newDone = task.status !== "done";
    handleUpdateStatus(task._id, newDone ? "done" : "pending");
    debouncedUpdateStatus(newDone);
  };

  return (
    <motion.div
      layout
      className={`task-card ${task.status === "done" && "completed"}`}
      variants={taskVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <span
        className="task-category"
        style={{
          backgroundColor: CategoryBackground[task.category],
        }}
      >
        {Category[task.category]}
      </span>
      <div className="task-content">
        <div className="task-content-left">
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
          {/* {isEdit ? (
            <TextField
              multiline
              rows={3}
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
            <div
              className={`task-title ${task.status === "done" && "completed"}`}
            >
              {text}
            </div>
          )} */}
          <div
            className={`task-title ${task.status === "done" && "completed"}`}
          >
            {text}
          </div>
        </div>
        <div className="task-actions">
          {/* {isEdit ? (
            <button onClick={handleEdit} className="action-button">
              <FileCheck size={16} />
            </button>
          ) : (
            <button onClick={() => setIsEdit(true)} className="action-button">
              <Edit3 size={16} />
            </button>
          )} */}
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

export default TaskCard;
