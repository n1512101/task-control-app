import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";

interface IProps {
  alwaysAvailable: boolean;
  isAllDay: boolean;
  handleDatePicker: (
    e: PickerValue,
    setTime: (time: string) => void,
    time: string
  ) => void;
  handleTimePicker: (
    e: PickerValue,
    setTime: (time: string) => void,
    time: string
  ) => void;
  time: string;
  setTime: (time: string) => void;
}

// カレンダーと時間選択ピッカー
const CalendarAndTimePicker = ({
  alwaysAvailable,
  isAllDay,
  handleDatePicker,
  handleTimePicker,
  time,
  setTime,
}: IProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        defaultValue={dayjs(time)}
        disablePast
        disabled={!alwaysAvailable && isAllDay}
        onChange={(e) => handleDatePicker(e, setTime, time)}
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
                "@media (max-width: 480px)": {
                  height: "28px",
                  width: "120px",
                  fontSize: "12px",
                  padding: "0 8px",
                },
              },
              "& .MuiSvgIcon-root": {
                fontSize: "22px",
                color: "var(--icon-color)",
                "@media (max-width: 480px)": {
                  fontSize: "16px",
                },
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
        defaultValue={dayjs(time)}
        onChange={(e) => handleTimePicker(e, setTime, time)}
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
                "@media (max-width: 480px)": {
                  height: "28px",
                  width: "120px",
                  fontSize: "12px",
                  padding: "0 8px",
                },
              },
              "& .MuiSvgIcon-root": {
                fontSize: "22px",
                color: "var(--icon-color)",
                "@media (max-width: 480px)": {
                  fontSize: "16px",
                },
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
