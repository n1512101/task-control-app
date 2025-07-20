import { FC, ReactElement, useContext, useEffect, useState } from "react";
import { Calendar, dayjsLocalizer, View, Event } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import useGetAllTasks from "../../hooks/useGetAllTasks.hook";
import { ITask } from "../../interfaces/task.interface";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import TaskModal from "../TaskModal/TaskModal";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import CustomizedModal from "../Modal/Modal";
import useDeleteTask from "../../hooks/useDeleteTask.hook";
import {
  calendarEventPropGetter,
  calendarText,
  calendarFormats,
} from "../../utils/utils";
import { LoadingContext } from "../../context/LoadingContext";
import AddTaskButton from "../AddTaskButton/AddTaskButton";
import "./AllTasks.scss";

// dayjsのロケールを日本語に設定
dayjs.locale("ja");
const localizer = dayjsLocalizer(dayjs);

const AllTasks: FC = (): ReactElement => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<View>("month");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [eventDate, setEventDate] = useState<string>(""); // 選択されたイベントの日付を保持する
  const [openModal, setOpenModal] = useState<boolean>(false); // タスク詳細modalが開いているか
  const [open, setOpen] = useState(false); // タスク削除確認modalが開いているか
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null); // 削除対象のタスクID
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });

  // ローディング状態を管理するcontext
  const { setIsLoading } = useContext(LoadingContext);

  // タスク取得hook
  const { data, isSuccess, isPending, isError, refetch } = useGetAllTasks();
  // タスク削除hook
  const { mutate } = useDeleteTask();

  // 初期データ同期(初回のみ)
  useEffect(() => {
    if (isSuccess) {
      setTasks(
        data.tasks.map((task: ITask) => ({
          ...task,
          startDate: dayjs.utc(task.startDate).format("YYYY-MM-DD HH:mm"),
          endDate: dayjs.utc(task.endDate).format("YYYY-MM-DD HH:mm"),
        }))
      );
    }
    // ローディング状態の変更
    setIsLoading(isPending);
  }, [isSuccess, data, isPending, setIsLoading]);

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
    setEventDate(dayjs(event.start).format("YYYY-MM-DD"));
    setOpenModal(true);
  };

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
  };

  // 削除ボタンを押した際に動作する関数
  const openConfirmModal = (taskId: string) => {
    setOpen(true);
    setDeleteTargetId(taskId);
  };

  // 削除キャンセルもしくは削除完了後の処理
  const closeConfirmModal = () => {
    setOpen(false);
    setDeleteTargetId(null);
  };

  // タスクを削除する際に動作する関数
  const handleDelete = async () => {
    if (!deleteTargetId) return;
    mutate(
      { path: "/task", id: deleteTargetId },
      {
        onSuccess: (response) => {
          setTasks(tasks.filter((task) => task._id !== deleteTargetId));
          setProperty({
            open: true,
            message: response,
            severity: "success",
          });
        },
        onError: (error) => {
          setProperty({
            open: true,
            message: error.message,
            severity: "warning",
          });
        },
        onSettled: () => {
          closeConfirmModal();
        },
      }
    );
  };

  return (
    <div className="all-tasks">
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
              selectedTasks={tasks.filter(
                (task: ITask) =>
                  dayjs(task.startDate).format("YYYY-MM-DD") === eventDate
              )}
              setProperty={setProperty}
              setTasks={setTasks}
              onRequestDelete={openConfirmModal}
              eventDate={eventDate}
            />
          )}
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          <CustomizedModal
            open={open}
            closeModal={closeConfirmModal}
            handleDelete={handleDelete}
          />
          <Calendar
            selectable={true}
            views={["month", "day"]}
            defaultView="month"
            localizer={localizer}
            events={tasks.map((task: ITask) => ({
              id: task._id,
              title: task.description,
              start: dayjs(task.startDate).toDate(),
              end: dayjs(task.endDate).toDate(),
              allDay: task.isAllDay,
              category: task.category,
              status: task.status,
            }))}
            eventPropGetter={calendarEventPropGetter}
            date={date}
            view={view}
            messages={calendarText}
            formats={calendarFormats}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            onSelectEvent={handleSelectEvent}
          />
          <AddTaskButton redirectUrl="/home/all-tasks" />
        </>
      )}
    </div>
  );
};

export default AllTasks;
