import { FC, ReactElement } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import "./Modal.scss";

interface IProp {
  open: boolean;
  closeModal: () => void;
  handleDelete: () => void;
}

const CustomizedModal: FC<IProp> = ({
  open,
  closeModal,
  handleDelete,
}): ReactElement => {
  return (
    <Modal open={open} onClose={closeModal}>
      <Box className="modalbox">
        <Typography className="modalmessage">タスクを削除しますか？</Typography>
        <Button
          variant="contained"
          color="error"
          className="modalbtn"
          onClick={handleDelete}
        >
          削除
        </Button>
        <Button variant="contained" className="modalbtn" onClick={closeModal}>
          キャンセル
        </Button>
      </Box>
    </Modal>
  );
};

export default CustomizedModal;
