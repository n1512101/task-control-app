import { FC, ReactElement } from "react";
import useGetRoutine from "../../hooks/useGetRoutine.hook";
import "./WeekRoutine.scss";

const WeekRoutine: FC = (): ReactElement => {
  const { data, isSuccess, isPending, isError } = useGetRoutine("weekly");
  console.log(data);

  return <div className="weekRoutine">WeekRoutine</div>;
};

export default WeekRoutine;
