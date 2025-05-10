import { FC, ReactElement, useState } from "react";
import { motion } from "framer-motion";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import { IRoutineTask } from "../../interfaces/routine.interface";
import TaskCard from "../TaskCard/TaskCard";
import CustomizedSnackBar from "../SnackBar/SnackBar";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import "./WeekRoutine.scss";

// アニメーション設定
const containerVariants = {
  visible: { opacity: 1, transition: { duration: 0.5 } },
  hidden: { opacity: 0 },
};

// 今週のルーティンコンポーネント
const WeekRoutine: FC = (): ReactElement => {
  // データ取得hook
  const { data, isSuccess, isPending, isError, refetch } =
    useGetRoutine("weekly");

  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
  };

  return (
    <div className="weekRoutine">
      {isPending && <div>読み込み中...</div>}
      {isError && (
        <div className="error">
          <p>データの取得に失敗しました。</p>
          <p>再読み込みしてください。</p>
          <CustomizedButton onClick={() => refetch()}>再試行</CustomizedButton>
        </div>
      )}
      {isSuccess && data.data.length === 0 ? (
        <p className="noroutine">ルーティンがありません</p>
      ) : (
        <motion.div
          className="container"
          variants={containerVariants}
          animate="visible"
          initial="hidden"
        >
          <CustomizedSnackBar property={property} handleClose={handleClose} />
          {data?.data.map((task: IRoutineTask) => (
            <TaskCard task={task} key={task._id} setProperty={setProperty} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WeekRoutine;
