import { FC, ReactElement, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer, View, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import useGetAllTasks from "../../hooks/useGetAllTasks.hook";
import { IEventTask, ITask } from "../../interfaces/task.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import TaskModal from "../TaskModal/TaskModal";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
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
};

// カテゴリーごとにイベントの背景色を設定する関数
const eventPropGetter = (event: any) => {
  let backgroundColor = "";
  let textDecoration = "";
  let opacity = 1;
  switch (event.category) {
    case "study":
      backgroundColor = "rgba(255, 0, 0, 0.6)";
      break;
    case "job":
      backgroundColor = "rgba(3, 170, 3, 0.6)";
      break;
    case "recreation":
      backgroundColor = "rgba(2, 147, 237, 0.6)";
      break;
    case "exercise":
      backgroundColor = "rgba(221, 144, 1, 0.6)";
      break;
    default:
      backgroundColor = "rgba(255, 255, 255, 0.6)";
      break;
  }
  switch (event.status) {
    case "done":
      textDecoration = "line-through var(--base-color) double";
      opacity = 0.6;
      break;
    case "pending":
      textDecoration = "none";
      break;
  }
  return {
    style: {
      backgroundColor,
      textDecoration,
      opacity,
    },
  };
};

const AllTasks: FC = (): ReactElement => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("month");
  const [tasks, setTasks] = useState<IEventTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<IEventTask[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });

  // タスク取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetAllTasks();

  // 初期データ同期(初回のみ)
  useEffect(() => {
    if (isSuccess) {
      const fixedTasks = data.tasks.map((task: ITask) => ({
        id: task._id,
        title: task.description,
        start: dayjs(task.startDate).add(-9, "hour").toDate(),
        end: dayjs(task.endDate).add(-9, "hour").toDate(),
        allDay: task.isAllDay,
        category: task.category,
        status: task.status,
      }));
      setTasks(fixedTasks);
    }
  }, [isSuccess, data]);

  // 日付を変更した際に動作する関数
  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  // 表示を変更した際に動作する関数
  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  // イベントをクリックした際に動作する関数
  const handleSelectEvent = (event: Event) => {
    setSelectedTasks(
      tasks.filter(
        (task: IEventTask) =>
          dayjs(event.start).format("YYYY-MM-DD") ===
          dayjs(task.start).format("YYYY-MM-DD")
      )
    );
    setOpenModal(true);
  };

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
  };

  return (
    <div className="all-tasks">
      {isPending && <div>読み込み中...</div>}
      {isError && (
        <div className="error">
          <p>データの取得に失敗しました。</p>
          <p>再読み込みしてください。</p>
          <CustomizedButton onClick={() => refetch()}>再試行</CustomizedButton>
        </div>
      )}
      {isSuccess && (
        <>
          {openModal && (
            <TaskModal
              setOpenModal={setOpenModal}
              selectedTasks={selectedTasks}
              setSelectedTasks={setSelectedTasks}
              setProperty={setProperty}
            />
          )}
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <Calendar
            selectable={true}
            views={["month", "day"]}
            defaultView="month"
            localizer={localizer}
            events={tasks}
            eventPropGetter={eventPropGetter}
            date={date}
            view={view}
            messages={messages}
            formats={formats}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            onSelectEvent={handleSelectEvent}
          />
        </>
      )}
    </div>
  );
};

export default AllTasks;
