import { useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskFormSchema as schema,
  TaskFormSchema as Schema,
} from "../../utils/utils";
import Switch from "@mui/material/Switch";
import CalendarAndTimePicker from "../CalendarAndTimePicker/CalendarAndTimePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { ICategory, ITaskResponse } from "../../interfaces/task.interface";
import "./TaskUpdateDrawer.scss";

const TaskUpdateDrawer = ({
  task,
  setTasks,
}: {
  task: ITaskResponse;
  setTasks: (tasks: ITaskResponse[]) => void;
}) => {
  const {
    _id,
    startDate,
    endDate,
    category: taskCategory,
    description,
    status,
    isAllDay: isTaskAllDay,
  } = task;

  const [isAllDay, setIsAllDay] = useState<boolean>(isTaskAllDay);
  const [startTime, setStartTime] = useState<string>(
    dayjs(startDate).format("YYYY-MM-DD HH:mm")
  );
  const [endTime, setEndTime] = useState<string>(
    dayjs(endDate).format("YYYY-MM-DD HH:mm")
  );
  const [category, setCategory] = useState<ICategory>(taskCategory);

  // react-hook-form
  const {
    register,
    handleSubmit,
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

  const onSubmit = (data: Schema) => {};

  return (
    <div className="task-drawer">
      <div className="task-drawer-handler"></div>
      <form className="task-drawer-form" onSubmit={handleSubmit(onSubmit)}>
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
            <input type="radio" name="category" value="study" id="study" />
            <label htmlFor="study">勉強</label>
            <input type="radio" name="category" value="job" id="job" />
            <label htmlFor="job">仕事</label>
            <input
              type="radio"
              name="category"
              value="recreation"
              id="recreation"
            />
            <label htmlFor="recreation">娯楽</label>
            <input
              type="radio"
              name="category"
              value="exercise"
              id="exercise"
            />
            <label htmlFor="exercise">運動</label>
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
        <button className="cancel-button" type="button">
          キャンセル
        </button>
        <button className="submit-button" type="submit">
          保存
        </button>
      </form>
    </div>
  );
};

export default TaskUpdateDrawer;
