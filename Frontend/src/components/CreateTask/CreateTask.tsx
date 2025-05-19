import { FC, ReactElement, useState } from "react";
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

  // snackbarを閉じる関数
  const handleClose = () => {
    setProperty({ ...property, open: false });
  };

  // カードがひっくり返している状態か
  const [isFlipped, setIsFlipped] = useState(false);
  // アニメーション実行中か
  const [isAnimating, setIsAnimating] = useState(false);

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
