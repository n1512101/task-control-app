import { useState, Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  taskFormSchema as schema,
  TaskFormSchema as Schema,
} from "../../utils/utils";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { FileType, Package, Pen } from "lucide-react";
import {
  ICategory,
  IRepeatType,
  IRoutine,
} from "../../interfaces/task.interface";
import { drawerVariants } from "../../utils/utils";
import useUpdateTask from "../../hooks/useUpdateTask.hook";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import "./RoutineUpdateDrawer.scss";

const RoutineUpdateDrawer = ({
  task,
  setRoutines,
  setEditTargetId,
  setProperty,
}: {
  task: IRoutine;
  setRoutines: Dispatch<SetStateAction<IRoutine[]>>;
  setEditTargetId: (id: string) => void;
  setProperty: Dispatch<SetStateAction<ISnackbarProperty>>;
}) => {
  const {
    _id,
    repeatType: taskRepeatType,
    category: taskCategory,
    description,
  } = task;

  const [repeatType, setRepeatType] = useState<IRepeatType>(taskRepeatType);
  const [category, setCategory] = useState<ICategory>(taskCategory);

  // データ更新hook
  const { mutate } = useUpdateTask();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // 保存ボタンを押した際に動作する関数
  const onSubmit = (data: Schema) => {
    const updateFields = {
      _id,
      repeatType,
      category,
      description: data.description,
    };
    // データベース更新
    mutate(
      {
        path: "/routine",
        task: updateFields,
      },
      {
        onSuccess: (message) => {
          setRoutines((routines) =>
            routines.map((routine) =>
              routine._id === _id ? { ...routine, ...updateFields } : routine
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
      className="routine-drawer"
      variants={drawerVariants}
      initial="initial"
      animate="visible"
      exit="exit"
    >
      <div className="routine-drawer-container">
        <div
          className="routine-drawer-handler"
          onClick={() => setEditTargetId("")}
        ></div>
        <form className="routine-drawer-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <div className="section-title">
              <div className="section-icon">
                <FileType
                  size={16}
                  strokeWidth={3}
                  style={{ verticalAlign: "text-top" }}
                />
              </div>
              <span>タイプ</span>
            </div>
            <div className="type-selector">
              <FormControl>
                <RadioGroup
                  row
                  value={repeatType}
                  onChange={(e) => setRepeatType(e.target.value as IRepeatType)}
                >
                  <FormControlLabel
                    value="daily"
                    control={<Radio size="small" />}
                    label="毎日"
                  />
                  <FormControlLabel
                    value="weekly"
                    control={<Radio size="small" />}
                    label="毎週"
                  />
                </RadioGroup>
              </FormControl>
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
              className="routine-textarea"
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

export default RoutineUpdateDrawer;
