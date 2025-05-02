import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import "./CreateRoutine.scss";

const CreateRoutine = () => {
  return (
    <div className="createRoutine">
      <div className="card">
        <form className="createRoutineForm">
          <div className="formControl">
            <span className="tag">タイプ：</span>
            <Select defaultValue="daily" className="select">
              <MenuItem value="daily">日ごと</MenuItem>
              <MenuItem value="weekly">週ごと</MenuItem>
            </Select>
          </div>
          <div className="formControl">
            <span className="tag">カテゴリー：</span>
            <Select defaultValue="study" className="select">
              <MenuItem value="study">勉強</MenuItem>
              <MenuItem value="job">仕事</MenuItem>
              <MenuItem value="recreation">娯楽</MenuItem>
              <MenuItem value="exercise">運動</MenuItem>
            </Select>
          </div>
          <div className="formControl">
            <span className="tag">タスク内容：</span>
            <TextField
              multiline
              rows={3}
              className="text"
              slotProps={{
                htmlInput: {
                  sx: { color: "var(--base-color)" },
                },
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoutine;
