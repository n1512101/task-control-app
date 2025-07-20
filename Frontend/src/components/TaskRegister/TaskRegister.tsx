import { FC, ReactElement, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskFormSchema as schema,
  TaskFormSchema as Schema,
} from "../../utils/utils";
import Switch from "@mui/material/Switch";
import dayjs from "dayjs";
import { PickerValue } from "@mui/x-date-pickers/internals";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import { ICategory } from "../../interfaces/task.interface";
import useCreateTask from "../../hooks/useCreateTask.hook";
import CalendarAndTimePicker from "../CalendarAndTimePicker/CalendarAndTimePicker";
import { LoadingContext } from "../../context/LoadingContext";
import "./TaskRegister.scss";

interface IProps {
  setProperty: (property: ISnackbarProperty) => void;
  isFlipped: boolean;
  handleFlip: () => void;
  setIsAnimating: (isAnimating: boolean) => void;
}

const TaskRegister: FC<IProps> = ({
  setProperty,
  isFlipped,
  handleFlip,
  setIsAnimating,
}): ReactElement => {
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>(
    dayjs().format("YYYY-MM-DD HH:mm")
  );
  const [endTime, setEndTime] = useState<string>(
    dayjs().add(1, "hour").format("YYYY-MM-DD HH:mm")
  );
  const [category, setCategory] = useState<ICategory>("study");

  // ローディング状態を管理するcontext
  const { setIsLoading } = useContext(LoadingContext);
  const { mutate, isPending } = useCreateTask();

  useEffect(() => {
    // ローディング状態の変更
    setIsLoading(isPending);
  }, [isPending, setIsLoading]);

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // DatePicker日付選択した際に動作する関数
  const handleDatePicker = (
    e: PickerValue,
    setTime: (time: string) => void,
    time: string
  ) => {
    setTime(`${e?.format("YYYY-MM-DD")} ${dayjs(time).format("HH:mm")}`);
  };

  // TimePicker時間選択した際に動作する関数
  const handleTimePicker = (
    e: PickerValue,
    setTime: (time: string) => void,
    time: string
  ) => {
    setTime(`${dayjs(time).format("YYYY-MM-DD")} ${e?.format("HH:mm")}`);
  };

  // タスク作成ボタンを押した際に動作する関数
  const onSubmit = (data: Schema) => {
    const startDate = isAllDay
      ? `${dayjs(startTime).format("YYYY-MM-DD")} 00:00`
      : startTime;
    const endDate = isAllDay
      ? `${dayjs(startTime).format("YYYY-MM-DD")} 23:59`
      : endTime;

    if (!dayjs(endDate).isAfter(dayjs(startDate))) {
      setProperty({
        open: true,
        message: "開始日時と終了日時が不適切です",
        severity: "warning",
      });
      return;
    }
    mutate(
      {
        ...data,
        status: "pending",
        category,
        startDate,
        endDate,
        isAllDay,
      },
      {
        // タスク作成成功の場合
        onSuccess: (response) => {
          setProperty({
            open: true,
            message: response,
            severity: "success",
          });
          reset();
        },
        // タスク作成失敗の場合
        onError: (error) => {
          setProperty({
            open: true,
            message: error.message,
            severity: "warning",
          });
        },
      }
    );
  };

  return (
    <form
      className="task-form-container"
      onSubmit={handleSubmit(onSubmit)}
      style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}
      onTransitionEnd={() => setIsAnimating(false)}
    >
      <div className="task-header">
        <h2 className="task-title">
          <span>✨</span>
          タスク登録
          <span>✨</span>
        </h2>
      </div>
      <div className="task-form-content">
        <div className="form-section form-date-section">
          <div className="section-title">
            <span className="section-number">1</span>
            <span>日時設定</span>
          </div>
          <div className="date-time-selector">
            <div className="all-day-toggle">
              <Switch
                checked={isAllDay}
                onChange={() => setIsAllDay(!isAllDay)}
              />
              <span className="toggle-label">終日のタスク</span>
            </div>
            <div className="datetime-container">
              <div className="datetime-group">
                <div className="datetime-label">開始日時</div>
                <CalendarAndTimePicker
                  alwaysAvailable={true}
                  isAllDay={isAllDay}
                  disablePast={true}
                  handleDatePicker={handleDatePicker}
                  handleTimePicker={handleTimePicker}
                  time={startTime}
                  setTime={setStartTime}
                />
              </div>
              <div className="datetime-group">
                <div className="datetime-label">終了日時</div>
                <CalendarAndTimePicker
                  alwaysAvailable={false}
                  isAllDay={isAllDay}
                  disablePast={true}
                  handleDatePicker={handleDatePicker}
                  handleTimePicker={handleTimePicker}
                  time={endTime}
                  setTime={setEndTime}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">2</span>
            <span>カテゴリー</span>
          </div>
          <div className="category-selector">
            <div
              className={`category-card ${
                category === "study" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("study")}
            >
              <span className="category-emoji">📚</span>
              <span className="category-label">勉強</span>
            </div>
            <div
              className={`category-card ${
                category === "job" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("job")}
            >
              <span className="category-emoji">💼</span>
              <span className="category-label">仕事</span>
            </div>
            <div
              className={`category-card ${
                category === "recreation" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("recreation")}
            >
              <span className="category-emoji">🎮</span>
              <span className="category-label">娯楽</span>
            </div>
            <div
              className={`category-card ${
                category === "exercise" ? "category-card-active" : ""
              }`}
              onClick={() => setCategory("exercise")}
            >
              <span className="category-emoji">🏃</span>
              <span className="category-label">運動</span>
            </div>
          </div>
        </div>
        <div className="form-section">
          <div className="section-title">
            <span className="section-number">3</span>
            <span>タスク内容</span>
          </div>
          <textarea
            className="task-textarea"
            placeholder="タスクを入力..."
            rows={5}
            {...register("description")}
          />
          {errors.description && (
            <div className="error-message">
              ⚠️ タスクの内容を入力してください
            </div>
          )}
        </div>
        <button className="submit-button" type="submit">
          タスク作成
        </button>
      </div>
      <div className="switch-routine">
        <span onClick={handleFlip}>ルーティン登録</span>
      </div>
    </form>
  );
};

export default TaskRegister;
