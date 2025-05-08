import { FC, ReactElement } from "react";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import CustomizedButton from "../CustomizedButton/CustomizedButton";
import { IRoutineTask } from "../../interfaces/routine.interface";
import "./WeekRoutine.scss";
import TaskCard from "../TaskCard/TaskCard";

// 今週のルーティンコンポーネント
const WeekRoutine: FC = (): ReactElement => {
  const { data, isSuccess, isPending, isError, refetch } =
    useGetRoutine("weekly");

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
        <div className="container">
          {data?.data.map((task: IRoutineTask) => (
            <TaskCard task={task} key={task._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekRoutine;
