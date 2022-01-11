import Menu from "@heroicons/react/outline/MenuIcon";
import React, { FC, useState } from "react";
import { Drawer } from "./components/drawer";

interface IProps {
  reset: Function;
}

export const View: FC<IProps> = (props) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <div className="relative w-full h-full">
      <div className="w-full h-1/12">
        <div className="flex flex-wrap items-center justify-between px-2 py-2 ">
          <Menu
            onClick={() => setDrawerOpen(true)}
            className="w-6 h-6 cursor-pointer text-clubred-dark hover:text-clubred-light "
          />
          <img className="w-auto h-4" src="/logo.svg" alt="" />
          <div className="w-1"></div>
        </div>
        <div className="w-full h-px bg-gray-700"></div>
      </div>
      <div className="flex flex-col items-center justify-center w-full px-8 h-11/12">
        <img className="w-auto h-20" src="/logo.svg" alt="" />
      </div>

      <Drawer
        reset={props.reset}
        open={drawerOpen}
        onDrawerClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};
