import React from "react";

export const Toast = (props: { visible: boolean; msg: string }) => {
  return (
    <div
      className={`${
        props.visible ? "transform translate-y-0" : "transform translate-y-full"
      } absolute z-10 transition-transform ease-in-out left-0 right-0 w-full duration-500 bg-green-500 bottom-0 h-10 px-2 py-2 `}
    >
      {props.msg}
    </div>
  );
};
