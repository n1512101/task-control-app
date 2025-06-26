import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";

// カレンダーと時間選択ピッカー
const CalendarAndTimePicker = ({
  setDay,
  setTime,
  alwaysAvailable,
  isAllDay,
}: {
  setDay: (day: string) => void;
  setTime: (time: string) => void;
  alwaysAvailable: boolean;
  isAllDay: boolean;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        defaultValue={dayjs()}
        disablePast
        disabled={!alwaysAvailable && isAllDay}
        onChange={(e) => setDay(e?.format("YYYY-MM-DD")!)}
        slotProps={{
          textField: {
            sx: {
              "& .MuiPickersInputBase-sectionsContainer": {
                color: "var(--base-color)",
              },
              "& .MuiPickersOutlinedInput-root": {
                border: "1px solid #e5e7eb",
              },
              "& .MuiPickersInputBase-root": {
                height: "35px",
                width: "140px",
                fontSize: "14px",
                padding: "0 12px",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "22px",
                color: "var(--icon-color)",
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                backgroundColor: "#f0f8ff", // カレンダーポップアップの背景色
              },
              "& .MuiTypography-root": {
                color: "#000080", // カレンダー内のテキストの色
              },
              "& .MuiPickersDay-root": {
                color: "#000080", // 日付の文字色
              },
            },
          },
        }}
      />
      <TimePicker
        defaultValue={dayjs()}
        onChange={(e) => setTime(e?.format("HH:mm")!)}
        disabled={isAllDay}
        slotProps={{
          textField: {
            sx: {
              "& .MuiPickersInputBase-sectionsContainer": {
                color: "var(--base-color)",
              },
              "& .MuiPickersOutlinedInput-root": {
                border: "1px solid #e5e7eb",
              },
              "& .MuiPickersInputBase-root": {
                height: "35px",
                width: "140px",
                fontSize: "14px",
                padding: "0 12px",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "22px",
                color: "var(--icon-color)",
              },
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                backgroundColor: "#f0f8ff", // タイマーポップアップの背景色
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CalendarAndTimePicker;
