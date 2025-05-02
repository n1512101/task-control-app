import { FC, ReactElement, useState } from "react";
import HomeHeader from "../../components/HomeHeader/HomeHeader";
import SideBar from "../../components/SideBar/SideBar";
import { Outlet } from "react-router-dom";

const Home: FC = (): ReactElement => {
  // サイドバーが開いているかどうか
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div>
      <HomeHeader open={open} setOpen={setOpen} />
      <SideBar open={open} setOpen={setOpen} />
      <Outlet />
    </div>
  );
};

export default Home;
