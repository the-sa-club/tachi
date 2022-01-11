import React, { FC, useState } from "react";
import { useHistory } from "react-router";
import hdWallet from "../../services/hdWallet";
import { IBaseProps } from "../BaseLayout";
import { View } from "./view";

interface IProps extends IBaseProps {}

export const Container: FC<IProps> = (props) => {
  const history = useHistory();
  const [page, setPage] = useState<string>("main");
  const [mnemonic, setMnemonic] = useState<string>("");

  const onCreateNewClick = async () => {
    setPage("seed");
    setMnemonic(hdWallet.getNewMnemonic());
  };

  const onLoadExistingOneClick = async () => {
    setPage("seed");
    setMnemonic("");
  };

  const onGenerateClick = async (
    newMnemonic: string,
    numAddresses: number = 100
  ) => {
    props.setLoading(true);
    await hdWallet.init(newMnemonic);
    props.setLoading(false);
    history.push("/");

    // const accounts = await generateAddressesFromSeed(numAddresses);
    // await new Promise((res, rej) =>
    //   setTimeout(() => {
    //     res(
    //       (() => {
    //         props.setLoading(false);
    //         setAccounts(accounts);
    //         props.onAccountsCreate();
    //       })()
    //     );
    //   }, 1000)
    // );
  };

  const onBackClick = () => {
    setPage("main");
  };

  return (
    <div className="relative w-full h-full">
      <View
        onCreateNewClick={onCreateNewClick}
        onLoadExistingOneClick={onLoadExistingOneClick}
        onGenerateClick={onGenerateClick}
        onBackClick={onBackClick}
        page={page}
        mnemonic={mnemonic}
      />
    </div>
  );
};
