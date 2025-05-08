import { useState } from "react";
import { Button, Checkbox, IconButton, Paper, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IRoutineTask } from "../../interfaces/routine.interface";
import { Category, CategoryBackground } from "../../utils/utils";
import "./TaskCard.scss";

const TaskCard = ({ task }: { task: IRoutineTask }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [text, setText] = useState<string>(task.description);

  return (
    <Paper
      elevation={3}
      className="task"
      sx={{ backgroundColor: "var(--paper-background)" }}
    >
      <span
        className="category"
        style={{
          backgroundColor: CategoryBackground[task.category],
        }}
      >
        {Category[task.category]}
      </span>

      {isEdit ? (
        <TextField
          multiline
          rows={3}
          className="textfield"
          value={text}
          fullWidth
          slotProps={{
            htmlInput: {
              sx: {
                color: "var(--base-color)",
              },
            },
          }}
        />
      ) : (
        <p className="content">{text}</p>
      )}

      <div className="controller">
        <Button className="btn" onClick={() => setIsEdit(!isEdit)}>
          {isEdit ? "保存" : "編集"}
        </Button>
        <Checkbox
          slotProps={{
            input: {
              "aria-label": "controlled",
            },
          }}
        />
        <IconButton aria-label="delete" size="medium" className="deletebtn">
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </div>
    </Paper>
  );
};

export default TaskCard;
