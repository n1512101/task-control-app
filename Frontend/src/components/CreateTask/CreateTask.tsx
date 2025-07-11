import { FC, ReactElement, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomizedSnackBar from "../CustomizedSnackBar/CustomizedSnackBar";
import ISnackbarProperty from "../../interfaces/snackbarProperty.interface";
import RoutineRegister from "../RoutineRegister/RoutineRegister";
import TaskRegister from "../TaskRegister/TaskRegister";
import "./CreateTask.scss";

const CreateTask: FC = (): ReactElement => {
  // snackbarに渡すプロパティー
  const [property, setProperty] = useState<ISnackbarProperty>({
    open: false,
    message: "",
    severity: "warning",
  });
  const location = useLocation();
  const navigate = useNavigate();

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
    // 別のページから遷移してきた場合、タスク作成後元のページに戻る
    if (location.state?.redirectUrl && property.severity === "success") {
      navigate(location.state.redirectUrl);
    }
  };

  // カードがひっくり返している状態か
  const [isFlipped, setIsFlipped] = useState(false);
  // アニメーション実行中か
  const [isAnimating, setIsAnimating] = useState(false);

  // 別のページから遷移してきた場合、パラメータによってisFlippedを設定
  useEffect(() => {
    if (location.state?.isFlipped) {
      setIsFlipped(location.state.isFlipped);
    }
  }, [location.state?.isFlipped]);

  // カードを裏返す関数
  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
  };

  return (
    <>
      <CustomizedSnackBar handleClose={handleClose} property={property} />
      <div className="create-task">
        <TaskRegister
          setProperty={setProperty}
          isFlipped={isFlipped}
          handleFlip={handleFlip}
          setIsAnimating={setIsAnimating}
        />
        <RoutineRegister
          setProperty={setProperty}
          isFlipped={isFlipped}
          handleFlip={handleFlip}
          setIsAnimating={setIsAnimating}
        />
      </div>
    </>
  );
};

export default CreateTask;
