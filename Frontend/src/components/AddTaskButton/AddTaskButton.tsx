import { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import "./AddTaskButton.scss";

// タスク追加画面へ遷移するボタン
const AddTaskButton = ({
  redirectUrl,
  isFlipped = false,
}: {
  redirectUrl: string;
  isFlipped?: boolean;
}): ReactElement => {
  const navigate = useNavigate();

  return (
    <div
      className="circle-plus-button"
      onClick={() =>
        navigate("/home/create-task", { state: { redirectUrl, isFlipped } })
      }
    >
      <Plus />
    </div>
  );
};

export default AddTaskButton;
