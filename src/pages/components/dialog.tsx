import React, { FC } from "react";

interface IProps {
  visible: boolean;
  msg: string;
  onCancel: Function;
  onApprove: Function;
  approveText?: string;
  cancelText?: string;
}

export const Dialog: FC<IProps> = (props) => {
  return (
    <>
      <div
        className={`${
          props.visible ? "" : "hidden"
        } absolute top-0 bottom-0 left-0 right-0 z-20 bg-gray-700 opacity-75 `}
        onClick={() => props.onCancel()}
      ></div>
      <div
        className={`${
          props.visible ? "visible bg-opacity-100" : "invisible bg-opacity-0"
        } absolute flex flex-wrap top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-4/5 h-2/5 pb-5 px-5  bg-gray-800`}
      >
        <div className="flex items-center justify-center w-full h-4/5">
          {props.msg}
        </div>
        <div className="flex justify-between w-full h-15">
          <button
            onClick={() => props.onCancel()}
            className="px-6 py-2 mb-1 rounded-sm active:bg-clubred-light bg-clubred-dark"
          >
            {props.cancelText ? props.cancelText : "Cancel"}
          </button>
          <button
            onClick={() => props.onApprove()}
            className="px-6 py-2 mb-1 rounded-sm active:bg-clubred-light bg-clubred-dark"
          >
            {props.approveText ? props.approveText : "Approve"}
          </button>
        </div>
      </div>
    </>
  );
};
