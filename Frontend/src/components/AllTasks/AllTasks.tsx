import { useState } from "react";
import { Dayjs } from "dayjs";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import "./AllTasks.scss";

const AllTasks = () => {
  // カレンダーの日付
  const [value, setValue] = useState<Dayjs | null>(null);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  // 未完了のタスクのみ表示するか
  const [onlyPending, setOnlyPending] = useState<boolean>(false);

  // console.log(value?.toDate());

  return (
    <div className="all-tasks">
      <div className="all-tasks-content">
        {openCalendar && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={value}
              onChange={(newValue) => setValue(newValue)}
              className="all-tasks-calendar"
              sx={{
                "& .MuiButtonBase-root": {
                  color: "var(--base-color)",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  color: "var(--base-color)",
                },
                "& .MuiPickersDay-root": {
                  color: "var(--base-color)",
                },
              }}
            />
            <div
              className="all-tasks-calendar-background"
              onClick={() => setOpenCalendar(false)}
            ></div>
          </LocalizationProvider>
        )}
        <div className="all-tasks-header">
          <Button
            variant="contained"
            className="left"
            onClick={() => setOpenCalendar(true)}
          >
            日付を選択
          </Button>
          <span className="right" onClick={() => setOnlyPending(!onlyPending)}>
            {onlyPending ? "全て表示" : "未完了のみ表示"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllTasks;
