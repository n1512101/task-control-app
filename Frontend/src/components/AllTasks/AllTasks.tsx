// import { FC, ReactElement, useEffect, useState } from "react";
// import dayjs from "dayjs";
// import "dayjs/locale/ja";
// import { AnimatePresence } from "framer-motion";
// import Button from "@mui/material/Button";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
// import useGetAllTasks from "../../hooks/useGetAllTasks.hook";
// import { ITaskResponse } from "../../interfaces/task.interface";
// import CustomizedButton from "../CustomizedButton/CustomizedButton";
// import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
// import CustomizedModal from "../Modal/Modal";
// import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
// import useDeleteTask from "../../hooks/useDeleteTask.hook";
// import TaskCard from "../TaskCard/TaskCard";
// import SelectCompletedTaskButton from "../SelectCompletedTaskButton/SelectCompletedTaskButton";
// import "./AllTasks.scss";

// interface CommonButtonProps {
//   label: string;
//   onClick: () => void;
// }

// const CommonButton: FC<CommonButtonProps> = ({
//   label,
//   onClick,
// }): ReactElement => (
//   <Button
//     variant="contained"
//     onClick={onClick}
//     sx={{
//       fontSize: {
//         xs: "12px",
//         sm: "14px",
//       },
//     }}
//   >
//     {label}
//   </Button>
// );

// // tasksの型
// type ITasks = Record<string, ITaskResponse[]>;

// const AllTasks: FC = (): ReactElement => {
//   // カレンダーの日付
//   const [selectedDate, setSelectedDate] = useState<string | null>(null);
//   const [openCalendar, setOpenCalendar] = useState<boolean>(false);
//   const [tasks, setTasks] = useState<ITasks>({});
//   // snackbarに渡すプロパティー
//   const [property, setProperty] = useState<ISnackbarProperty>({
//     open: false,
//     message: "",
//     severity: "warning",
//   });
//   const [open, setOpen] = useState(false); // modalが開いているか
//   const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
//   // 未完了のタスクのみを表示するかどうか
//   const [onlyPending, setOnlyPending] = useState<boolean>(false);

//   // タスク取得hook
//   const { data, isSuccess, isPending, isError, refetch } = useGetAllTasks();
//   // タスク削除hook
//   const { mutate } = useDeleteTask();

//   // 初期データ同期(初回のみ)
//   useEffect(() => {
//     if (isSuccess) setTasks(data.data.tasks);
//   }, [isSuccess, data]);

//   // snackbarを閉じる関数
//   const handleClose = () => {
//     setProperty({ ...property, open: false });
//   };

//   // 削除ボタンを押した際に動作する関数
//   const openModal = (taskId: string) => {
//     setOpen(true);
//     setDeleteTargetId(taskId);
//   };

//   // 削除キャンセルもしくは削除完了後の処理
//   const closeModal = () => {
//     setOpen(false);
//     setDeleteTargetId(null);
//   };

//   // タスクを削除する際に動作する関数
//   const handleDelete = async () => {
//     if (!deleteTargetId) return;
//     mutate(
//       { path: "/task", id: deleteTargetId },
//       {
//         onSuccess: (response) => {
//           setTasks((prev: ITasks) => {
//             const newTasks: typeof prev = {};
//             for (const date in prev) {
//               newTasks[date] = prev[date].filter(
//                 (task) => task._id !== deleteTargetId
//               );
//             }
//             return newTasks;
//           });
//           setProperty({
//             open: true,
//             message: response,
//             severity: "success",
//           });
//         },
//         onError: (error) => {
//           setProperty({
//             open: true,
//             message: error.message,
//             severity: "warning",
//           });
//         },
//         onSettled: () => {
//           closeModal();
//         },
//       }
//     );
//   };

//   // tasks内の指定する要素のstatusを更新する関数
//   const handleUpdateStatus = (
//     taskId: string,
//     newStatus: ITaskResponse["status"]
//   ) => {
//     setTasks((prev: ITasks) => {
//       const updateTasks: typeof prev = {};
//       for (const date in prev) {
//         updateTasks[date] = prev[date].map((task) =>
//           task._id === taskId ? { ...task, status: newStatus } : task
//         );
//       }
//       return updateTasks;
//     });
//   };

//   // タスクの日付を取り出す
//   const tasksDate = Object.keys(tasks);

//   return (
//     <div className="all-tasks">
//       {isPending && <div>読み込み中...</div>}
//       {isError && (
//         <div className="error">
//           <p>データの取得に失敗しました。</p>
//           <p>再読み込みしてください。</p>
//           <CustomizedButton onClick={() => refetch()}>再試行</CustomizedButton>
//         </div>
//       )}
//       {isSuccess && (
//         <div className="all-tasks-content">
//           <CustomizedSnackBar property={property} handleClose={handleClose} />
//           <CustomizedModal
//             open={open}
//             closeModal={closeModal}
//             handleDelete={handleDelete}
//           />
//           {openCalendar && (
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DateCalendar
//                 minDate={dayjs().add(-3, "month")} // 3ヶ月前まで選択可能
//                 onChange={(newDate) =>
//                   setSelectedDate(dayjs(newDate?.toDate()).format("YYYY-MM-DD"))
//                 }
//                 className="all-tasks-calendar"
//                 sx={{
//                   "& .MuiButtonBase-root": {
//                     color: "var(--base-color)",
//                   },
//                   "& .MuiDayCalendar-weekDayLabel": {
//                     color: "var(--base-color)",
//                   },
//                   "& .MuiPickersDay-root": {
//                     color: "var(--base-color)",
//                   },
//                 }}
//               />
//               <div
//                 className="all-tasks-calendar-background"
//                 onClick={() => setOpenCalendar(false)}
//               ></div>
//             </LocalizationProvider>
//           )}
//           <div className="all-tasks-header">
//             <div className="left">
//               <CommonButton
//                 label="全てのタスク"
//                 onClick={() => setSelectedDate(null)}
//               />
//               <CommonButton
//                 label="日付を選択"
//                 onClick={() => setOpenCalendar(true)}
//               />
//             </div>
//             <SelectCompletedTaskButton
//               onlyPending={onlyPending}
//               setOnlyPending={setOnlyPending}
//             />
//           </div>
//           {tasksDate.length === 0 ||
//           (selectedDate && !tasksDate.includes(selectedDate)) ? (
//             <div className="no-task">タスクがありません</div>
//           ) : (
//             tasksDate
//               .filter((date: string) =>
//                 selectedDate ? date === selectedDate : true
//               )
//               .sort()
//               .map((date: string) => (
//                 <div className="all-tasks-container" key={date}>
//                   <div className="all-tasks-date">
//                     {dayjs(date).locale("ja").format("YYYY年MM月DD日 (ddd)")}
//                   </div>
//                   <AnimatePresence>
//                     {tasks[date]
//                       .filter((task) =>
//                         onlyPending ? task.status === "pending" : true
//                       )
//                       .map((task: ITaskResponse) => (
//                         <TaskCard
//                           task={task}
//                           key={task._id}
//                           setProperty={setProperty}
//                           onRequestDelete={openModal}
//                           api="/task"
//                           handleUpdateStatus={handleUpdateStatus}
//                         />
//                       ))}
//                   </AnimatePresence>
//                 </div>
//               ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllTasks;

import { FC, ReactElement, useState } from "react";
import { Calendar, dayjsLocalizer, View, SlotInfo } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import "./AllTasks.scss";

// dayjsのロケールを日本語に設定
dayjs.locale("ja");

const localizer = dayjsLocalizer(dayjs);

// 日本語メッセージの設定
const messages = {
  previous: "前へ",
  next: "次へ",
  today: "今日",
  month: "月",
  week: "週",
  day: "日",
};

// カレンダーのタイトルのフォーマット設定
const formats = {
  monthHeaderFormat: (date: Date) => dayjs(date).format("YYYY年M月"),
  dayHeaderFormat: (date: Date) => dayjs(date).format("YYYY年M月D日 (ddd)"),
  dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);

    if (startDate.month() === endDate.month()) {
      return `${startDate.format("YYYY年M月D日")} - ${endDate.format("D日")}`;
    } else if (startDate.year() === endDate.year()) {
      return `${startDate.format("YYYY年M月D日")} - ${endDate.format(
        "M月D日"
      )}`;
    } else {
      return `${startDate.format("YYYY年M月D日")} - ${endDate.format(
        "YYYY年M月D日"
      )}`;
    }
  },
};

const AllTasks: FC = (): ReactElement => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("month");

  // スロットを選択した際に動作する関数
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    console.log(slotInfo);
  };

  // 日付を変更した際に動作する関数
  const handleNavigate = (newDate: Date) => {
    console.log("handleNavigate");
    setDate(newDate);
  };

  // 表示を変更した際に動作する関数
  const handleViewChange = (newView: View) => {
    console.log("handleViewChange");
    setView(newView);
  };

  return (
    <div className="all-tasks">
      <Calendar
        selectable={true}
        views={["month", "day"]}
        defaultView="month"
        localizer={localizer}
        events={[]}
        date={date}
        view={view}
        messages={messages}
        formats={formats}
        onSelectSlot={handleSelectSlot}
        onNavigate={handleNavigate}
        onView={handleViewChange}
      />
    </div>
  );
};

export default AllTasks;
