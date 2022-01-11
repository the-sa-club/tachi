import React, { FC } from "react";
import { Main } from "./components/main";
import { Seed } from "./components/seed";

interface IProps {
  onCreateNewClick: Function;
  onGenerateClick: Function;
  onBackClick: Function;
  onLoadExistingOneClick: Function;
  page: string;
  mnemonic: string;
}

export const View: FC<IProps> = (props) => {
  switch (props.page) {
    case "main":
      return (
        <Main
          onLoadExistingOneClick={props.onLoadExistingOneClick}
          onCreateNewClick={props.onCreateNewClick}
        />
      );
    case "seed":
      return (
        <Seed
          onBackClick={props.onBackClick}
          onGenerateClick={props.onGenerateClick}
          mnemonic={props.mnemonic}
        />
      );

    default:
      return (
        <Main
          onLoadExistingOneClick={props.onLoadExistingOneClick}
          onCreateNewClick={props.onCreateNewClick}
        />
      );
  }
};
