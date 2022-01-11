import React, { FC } from "react";

interface IProps {
  open: boolean;
  onDrawerClose: Function;
  reset: Function;
}

export const Drawer: FC<IProps> = (props) => {
  return (
    <>
      <div
        className={`${
          props.open ? "" : "hidden"
        } absolute top-0 bottom-0 left-0 right-0 z-10 bg-gray-700 opacity-75 `}
        onClick={() => props.onDrawerClose()}
      ></div>
      <div
        className={`${
          props.open ? "transform translate-x-0" : "transform -translate-x-full"
        } absolute top-0 bottom-0 z-20 w-3/5  py-4 transition-all duration-200 ease-in-out bg-gray-800 border-r border-clubred-dark`}
      >
        <button
          onClick={() => props.reset()}
          className="w-full px-2 py-2 mb-1 active:bg-clubred-dark"
        >
          Reset
        </button>
      </div>
    </>
  );
};
