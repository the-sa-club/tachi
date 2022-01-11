import ArrowLeft from "@heroicons/react/outline/ArrowLeftIcon";
import React, { FC, useState } from "react";

interface IProps {
  onGenerateClick: Function;
  onBackClick: Function;
  mnemonic: string;
}

export const Seed: FC<IProps> = (props) => {
  const [newMnemonic, setNewMnemonic] = useState<string>("");

  return (
    <div className="w-full h-full">
      <div className="w-full h-1/6">
        <div className="flex flex-wrap items-center justify-between px-2 py-2 ">
          <ArrowLeft
            onClick={() => props.onBackClick()}
            className="w-6 h-6 cursor-pointer text-clubred-dark hover:text-clubred-light "
          />
          <img className="w-auto h-4" src="/logo.svg" alt="" />
          <div className="w-1"></div>
        </div>
        <div className="w-full h-px bg-gray-700"></div>
      </div>

      <div className="flex flex-col items-center w-full px-8 h-5/6">
        {props.mnemonic ? (
          <>
            <label htmlFor="mnemonic">
              Please keep the Mnemonic phrase in safe place. You will need it to
              retrieve your accounts.
            </label>
            <textarea
              id="mnemonic"
              name="mnemonic"
              rows={3}
              readOnly
              className="w-full px-3 py-3 text-gray-300 bg-black border-2 rounded focus:outline-none border-clubred-dark"
              value={props.mnemonic}
            />
          </>
        ) : (
          <>
            <textarea
              id="mnemonic"
              name="mnemonic"
              rows={3}
              placeholder="Please type your mnemonic..."
              className="w-full px-3 py-3 text-gray-300 bg-black border-2 rounded focus:outline-none border-clubred-dark"
              value={newMnemonic}
              onChange={(e) => setNewMnemonic(e.target.value)}
            />
          </>
        )}

        <button
          onClick={() => {
            return props.onGenerateClick(
              !!props.mnemonic ? props.mnemonic : newMnemonic
            );
          }}
          className="w-full px-4 py-2 mt-4 rounded bg-clubred-dark hover:bg-clubred-light "
        >
          Generate
        </button>
      </div>
    </div>
  );
};
