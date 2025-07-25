import { useState, Dispatch, SetStateAction } from "react";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
import { ICategory, ITask } from "../../interfaces/task.interface";
import { drawerVariants } from "../../utils/utils";
import useUpdateTask from "../../hooks/useUpdateTask.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import "./TaskUpdateDrawer.scss";

const TaskUpdateDrawer = ({
  task,
  setTasks,
  setEditTargetId,
  setProperty,
}: {
  task: ITask;
  setTasks: Dispatch<SetStateAction<ITask[]>>;
  setEditTargetId: (id: string) => void;
  setProperty: (property: ISnackbarProperty) => void;
}) => {
  const {
    _id,
    startDate,
    endDate,
    category: taskCategory,
    description,
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

  // データ更新hook
  const { mutate } = useUpdateTask();

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

  // 保存ボタンを押した際に動作する関数
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
    const updateFields = {
      _id,
      isAllDay,
      startDate,
      endDate,
      category,
      description: data.description,
    };
    // データベース更新
    mutate(
      {
        path: "/task",
        task: updateFields,
      },
      {
        onSuccess: (message) => {
          setTasks((tasks) =>
            tasks.map((task) =>
              task._id === _id ? { ...task, ...updateFields } : task
            )
          );
          setProperty({
            open: true,
            message,
            severity: "success",
          });
          setEditTargetId("");
        },
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
    <motion.div
      className="task-drawer"
      variants={drawerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <div className="task-drawer-container">
        <div
          className="task-drawer-handler"
          onClick={() => setEditTargetId("")}
        ></div>
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
                disablePast={false}
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
                disablePast={false}
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
                <RadioGroup
                  row
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ICategory)}
                >
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
              defaultValue={description}
              {...register("description")}
            />
            {errors.description && (
              <div className="error-message">
                ⚠️ タスクの内容を入力してください
              </div>
            )}
          </div>
          <div className="btn-group">
            <button
              className="cancel-button btn"
              type="button"
              onClick={() => setEditTargetId("")}
            >
              キャンセル
            </button>
            <button className="submit-button btn" type="submit">
              保存
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TaskUpdateDrawer;
