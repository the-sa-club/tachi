import React, { FC, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { reduxStore } from "../../reduxStore";
import { setLoggedIn } from "../../reduxStore/features/authSlice";
import { useAppDispatch } from "../../reduxStore/hooks";
import authService from "../../services/authService";
import { IBaseProps } from "../BaseLayout";
import { View } from "./view";

interface IProps extends IBaseProps {}

export const Container: FC<IProps> = (props) => {
  const dispatch = useAppDispatch();
  const history = useHistory<{from: string}>();
  const [state, setState] = useState<"registered" | "pending" | "new">(
    "pending"
  );
  const [passwordErr, setPasswordErr] = useState<boolean>(false);

  const onCreatePassword = (password: string) => {
    authService.password = password;
    dispatch(setLoggedIn(true));
    history.push("/seed");
    console.log(reduxStore.getState());
  };

  const onLogin = async (password: string) => {
    try {
      await authService.login(password);
      dispatch(setLoggedIn(true));
      history.push(history.location.state.from);
    } catch (error) {
      setPasswordErr(true);
    }
  };

  useEffect(() => {
    authService.isRegistered().then((registered) => {
      if (registered) {
        setState("registered");
      } else {
        setState("new");
      }
    });
  }, []);

  return (
    <div className="relative w-full h-full">
      <View
        fresh={state == "new"}
        onCreatePassword={onCreatePassword}
        onLogin={onLogin}
        passwordErr={passwordErr}
      />
    </div>
  );
};
