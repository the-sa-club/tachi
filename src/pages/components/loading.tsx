import React from "react";

export const Loading = (props: { visible: boolean; topMsg?: string }) => {
  return (
    <div
      className={` text-white absolute flex flex-col  w-full h-full top-0 bottom-0 left-0 right-0 items-center justify-center  transition-all duration-75 ease-linear bg-clubred-light ${
        props.visible ? "visible bg-opacity-100" : "invisible bg-opacity-0"
      }`}
    >
      {props.topMsg ? (
        <>
          <span>{props.topMsg}</span><br/>
          <span>Loading ...</span>
        </>
      ) : (
        <span>Loading ...</span>
      )}
    </div>
  );
};
