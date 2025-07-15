import { useState } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskFormSchema as schema,
  TaskFormSchema as Schema,
} from "../../utils/utils";
import Switch from "@mui/material/Switch";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Clock, Calendar, Package, Pen } from "lucide-react";
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
      <div className="task-drawer-container">
        <div className="task-drawer-handler"></div>
        <form className="task-drawer-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <Clock
                  size={16}
                  strokeWidth={3}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
              <span>日時設定</span>
            </div>
            <div className="toggle-container">
              <span className="toggle-label">終日のタスク</span>
              <Switch
                checked={isAllDay}
                onChange={() => setIsAllDay(!isAllDay)}
              />
            </div>
            <div className="datetime-title">
              <div className="datetime-icon">
                <Calendar
                  size={16}
                  strokeWidth={3}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
              <span>開始日時</span>
            </div>
            <div className="datetime-picker">
              <CalendarAndTimePicker
                alwaysAvailable={true}
                isAllDay={isAllDay}
                handleDatePicker={handleDatePicker}
                handleTimePicker={handleTimePicker}
                time={startTime}
                setTime={setStartTime}
              />
            </div>
            <div className="datetime-title">
              <div className="datetime-icon">
                <Calendar
                  size={16}
                  strokeWidth={3}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
              <span>終了日時</span>
            </div>
            <div className="datetime-picker">
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
          <div className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <Package
                  size={16}
                  strokeWidth={3}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
              <span>カテゴリー</span>
            </div>
            <div className="category-selector">
              <FormControl>
                <RadioGroup row>
                  <FormControlLabel
                    value="study"
                    control={<Radio size="small" />}
                    label="勉強"
                  />
                  <FormControlLabel
                    value="job"
                    control={<Radio size="small" />}
                    label="仕事"
                  />
                  <FormControlLabel
                    value="recreation"
                    control={<Radio size="small" />}
                    label="娯楽"
                  />
                  <FormControlLabel
                    value="exercise"
                    control={<Radio size="small" />}
                    label="運動"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <Pen
                  size={16}
                  strokeWidth={3}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
              <span>タスク内容</span>
            </div>
            <textarea
              className="task-textarea"
              placeholder="タスクを入力..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <div className="error-message">
                ⚠️ タスクの内容を入力してください
              </div>
            )}
          </div>
          <div className="btn-group">
            <button className="cancel-button btn" type="button">
              キャンセル
            </button>
            <button className="submit-button btn" type="submit">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskUpdateDrawer;
