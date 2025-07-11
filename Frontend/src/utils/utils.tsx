import dayjs from "dayjs";
import z from "zod";

const Category = {
  study: "勉強",
  job: "仕事",
  recreation: "娯楽",
  exercise: "運動",
};

const CategoryBackground = {
  study: "rgba(255, 0, 0, 0.6)",
  job: "rgba(3, 170, 3, 0.6)",
  recreation: "rgba(2, 147, 237, 0.6)",
  exercise: "rgba(221, 144, 1, 0.6)",
};

// カレンダーのテキスト設定
const calendarText = {
  previous: "前へ",
  next: "次へ",
  today: "今日",
  month: "月",
  week: "週",
  day: "日",
};

// カレンダーのタイトルのフォーマット設定
const calendarFormats = {
  monthHeaderFormat: (date: Date) => dayjs(date).format("YYYY年M月"),
  dayHeaderFormat: (date: Date) => dayjs(date).format("YYYY年M月D日 (ddd)"),
};

// カテゴリーごとにイベントの背景色を設定する関数
const calendarEventPropGetter = (event: any) => {
  let backgroundColor = "";
  let textDecoration = "";
  let opacity = 1;
  switch (event.category) {
    case "study":
      backgroundColor = "rgba(255, 0, 0, 0.6)";
      break;
    case "job":
      backgroundColor = "rgba(3, 170, 3, 0.6)";
      break;
    case "recreation":
      backgroundColor = "rgba(2, 147, 237, 0.6)";
      break;
    case "exercise":
      backgroundColor = "rgba(221, 144, 1, 0.6)";
      break;
    default:
      backgroundColor = "rgba(255, 255, 255, 0.6)";
      break;
  }
  switch (event.status) {
    case "done":
      textDecoration = "line-through var(--base-color) double";
      opacity = 0.6;
      break;
    case "pending":
      textDecoration = "none";
      break;
  }
  return {
    style: {
      backgroundColor,
      textDecoration,
      opacity,
    },
  };
};

// アニメーション設定
const taskVariants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  initial: { opacity: 0, y: 20 },
  exit: { opacity: 0, x: -500, transition: { duration: 0.5 } },
};

// タスク登録フォームスキーマ定義
const taskFormSchema = z.object({
  description: z.string().nonempty(),
});
export type TaskFormSchema = z.infer<typeof taskFormSchema>;

export {
  Category,
  CategoryBackground,
  calendarText,
  calendarFormats,
  calendarEventPropGetter,
  taskVariants,
  taskFormSchema,
};
