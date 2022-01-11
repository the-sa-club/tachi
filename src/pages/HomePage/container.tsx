import React, { FC } from "react";
import { useHistory } from "react-router";
import { setLoggedIn } from "../../reduxStore/features/authSlice";
import { useAppDispatch } from "../../reduxStore/hooks";
import hdWallet from "../../services/hdWallet";
import { IBaseProps } from "../BaseLayout";
import { View } from "./view";

interface IProps extends IBaseProps {}
export const Container: FC<IProps> = (props) => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const reset = async () => {
    props.setDialog(
      "This action will remove all data from the plugin. Are you sure ?",
      () => {},
      async () => {
        await hdWallet.reset();
        dispatch(setLoggedIn(false));
        history.push("/");
      },
      "No",
      "Yes"
    );
  };

  return (
    <div className="relative w-full h-full">
      <View reset={reset} />
    </div>
  );
};
