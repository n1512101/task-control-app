import { ClipLoader } from "react-spinners";
import "./LoadingSpinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <ClipLoader size={35} color="#eee" />
    </div>
  );
};

export default LoadingSpinner;
