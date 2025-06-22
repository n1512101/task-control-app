import { ReactElement } from "react";
import "./SelectCompletedTaskButton.scss";

const SelectCompletedTaskButton = ({
  onlyPending,
  setOnlyPending,
}: {
  onlyPending: boolean;
  setOnlyPending: (onlyPending: boolean) => void;
}): ReactElement => {
  return (
    <button
      className="select-button"
      onClick={() => setOnlyPending(!onlyPending)}
    >
      {onlyPending ? "全て表示" : "未完了のみ表示"}
    </button>
  );
};

export default SelectCompletedTaskButton;
