import { FC, ReactElement } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import IProperty from "../../interfaces/snackbarProperty.interface";

interface CustomizedSnackBarProps {
  property: IProperty;
  handleClose: () => void;
}

const CustomizedSnackBar: FC<CustomizedSnackBarProps> = ({
  handleClose,
  property,
}): ReactElement => {
  return (
    <Snackbar
      open={property.open}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ mt: "60px" }}
      onClose={handleClose}
    >
      <Alert
        severity={property.severity}
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {property.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomizedSnackBar;
