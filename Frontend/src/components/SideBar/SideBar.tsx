import { FC, ReactElement } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import "./SideBar.scss";
import { NavigateFunction, useNavigate } from "react-router-dom";

interface PropsType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// サイドバーリストおよび対応するナビゲーション
const topOfSideBar = {
  本日のタスク: "",
  今週のルーティン: "weekroutine",
  過去のルーティン: "pastroutine",
};
const bottomOfSideBar = {
  タスクを作成: "createtask",
  ルーティンを作成: "createroutine",
};

// サイドバーコンポーネント
const SideBar: FC<PropsType> = ({ open, setOpen }): ReactElement => {
  const navigate: NavigateFunction = useNavigate();

  const DrawerList = (
    <Box
      className={`box ${open ? "open" : "close"}`}
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <List>
        {Object.keys(topOfSideBar).map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                navigate(`/home/${Object.values(topOfSideBar)[index]}`)
              }
            >
              <ListItemIcon>
                <TaskOutlinedIcon sx={{ color: "var(--base-color)" }} />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {Object.keys(bottomOfSideBar).map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() =>
                navigate(`/home/${Object.values(bottomOfSideBar)[index]}`)
              }
            >
              <ListItemIcon>
                <AddTaskRoundedIcon sx={{ color: "var(--base-color)" }} />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return <div>{DrawerList}</div>;
};

export default SideBar;
