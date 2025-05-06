import { FC, ReactElement, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import useCreateRoutine from "../../hooks/useCreateRoutine.hook";
import CustomizedSnackBar from "../SnackBar/SnackBar";
import IProperty from "../../interfaces/snackbarProperty.interface";
import { useNavigate } from "react-router-dom";
import "./CreateRoutine.scss";

// スキーマ定義
const schema = z.object({
  repeatType: z.enum(["daily", "weekly"]),
  category: z.enum(["study", "job", "recreation", "exercise"]),
  description: z.string().min(1, { message: "1文字以上入力してください" }),
});
type Schema = z.infer<typeof schema>;

const CreateRoutine: FC = (): ReactElement => {
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<IProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  // ルーティン作成成功か失敗か
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate } = useCreateRoutine();
  const navigate = useNavigate();

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
    if (isSuccess) navigate("/home/weekroutine");
    setIsSuccess(false);
  };

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // ルーティン作成ボタンを押した際に動作する関数
  const onSubmit = (data: Schema) => {
    mutate(
      { ...data, status: "pending" },
      {
        // ルーティン作成成功の場合
        onSuccess: (response) => {
          setIsSuccess(true);
          setProperty({
            open: true,
            message: response,
            severity: "success",
          });
        },
        // ルーティン作成失敗の場合
        onError: (error) => {
          setIsSuccess(false);
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
    <div className="createRoutine">
      <CustomizedSnackBar handleClose={handleClose} property={property} />
      <div className="card">
        <div className="title">
          <span>ルーティン登録</span>
        </div>
        <form className="createRoutineForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="typeForm">
            <span className="tag">タイプ：</span>
            <Select
              defaultValue="daily"
              className="select"
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      backgroundColor: "var(--input-background)",
                      color: "var(--base-color)",
                    },
                  },
                },
              }}
              {...register("repeatType")}
            >
              <MenuItem value="daily">日ごと</MenuItem>
              <MenuItem value="weekly">週ごと</MenuItem>
            </Select>
          </div>
          <div className="categoryForm">
            <span className="tag">カテゴリー：</span>
            <Select
              defaultValue="study"
              className="select"
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      backgroundColor: "var(--input-background)",
                      color: "var(--base-color)",
                    },
                  },
                },
              }}
              {...register("category")}
            >
              <MenuItem value="study">勉強</MenuItem>
              <MenuItem value="job">仕事</MenuItem>
              <MenuItem value="recreation">娯楽</MenuItem>
              <MenuItem value="exercise">運動</MenuItem>
            </Select>
          </div>
          <div className="descriptionForm">
            <div className="content">
              <span className="tag">タスク内容：</span>
              <TextField
                multiline
                rows={3}
                className="text"
                slotProps={{
                  htmlInput: {
                    sx: { color: "var(--base-color)" },
                  },
                }}
                {...register("description")}
              />
            </div>
            <div className="errorMessage">
              {errors.description && <span>{errors.description.message}</span>}
            </div>
          </div>
          <Button className="btn" variant="outlined" type="submit">
            ルーティン作成
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoutine;
