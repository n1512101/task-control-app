import { ClipLoader } from "react-spinners";
import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <ClipLoader color="#3784bc" />
    </div>
  );
};

export default LoadingSpinner;
