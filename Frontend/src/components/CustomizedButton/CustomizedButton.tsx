import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

const CustomizedButton = styled(Button)<ButtonProps>(() => ({
  color: "var(--base-color)",
  backgroundColor: "var(--button-color)",
  padding: "6px 15px",
  "&:hover": {
    backgroundColor: "var(--hover-button-color)",
  },
}));

export default CustomizedButton;
