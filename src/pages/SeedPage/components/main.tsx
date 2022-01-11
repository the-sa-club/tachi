import React, { FC } from "react";

interface IProps {
  onCreateNewClick: Function;
  onLoadExistingOneClick: Function;
}
export const Main: FC<IProps> = (props) => {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-center w-full px-8 h-5/6">
        <img className="w-auto h-20" src="/logo.svg" alt="" />
      </div>
      <div className="flex flex-col items-end w-full px-2 py-2 h-1/6">
        <button
          onClick={() => props.onCreateNewClick()}
          className="w-full px-4 py-2 rounded bg-clubred-dark hover:bg-clubred-light "
        >
          Generate Accounts With New Seed Phrase
        </button>
        <div className="w-full h-2"></div>
        <button
          onClick={() => props.onLoadExistingOneClick()}
          className="w-full px-4 py-2 rounded bg-clubred-dark hover:bg-clubred-light "
        >
          Generate Accounts With Existing One
        </button>
      </div>
    </div>
  );
};
