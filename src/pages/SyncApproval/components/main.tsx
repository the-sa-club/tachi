import React, { FC, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import authService from "../../../services/authService";
import hdWallet from "../../../services/hdWallet";
import { IBaseProps } from "../../BaseLayout";

interface IProps extends IBaseProps {
  sender: string;
}
const Main: FC<IProps> = (props) => {
  const [state, setState] = useState({
    errMsg: "",
    loggedIn: false,
    registered: false,
    loading: true,
  });

  useEffect(() => {
      authService.isRegistered().then((isRegistered) => {
        if (!isRegistered) {
          setState({
            errMsg: "Please load your account first then try again.",
            loggedIn: false,
            registered: false,
            loading: false,
          });
        } else if (authService.isAuthenticated()) {
          setState({
            errMsg: "",
            loggedIn: true,
            registered: true,
            loading: false,
          });
        } else {
          setState({
            errMsg: "Please login first then try again.",
            loggedIn: false,
            registered: true,
            loading: false,
          });
        }
      });
  }, []);

  let toRender = <></>;

  if (state.loading) {
    toRender = <></>;
  } else if (!state.registered) {
    toRender = (
      <div className="flex flex-col justify-center w-full h-full px-4 text-lg text-clubred-dark">
        <div className="w-full px-2 h-3/12">
          <img className="w-auto h-20 mx-auto " src="./icon.png" alt="" />
        </div>
        <div className="w-full px-8 text-center h-3/12">{state.errMsg}</div>
      </div>
    );

    // setTimeout(() => {
    //   localStorage.setItem("sync_msgs", JSON.stringify(""));
    //   localStorage.removeItem("sync_msgs");
    //   window.close();
    // }, 5000);
  } else if (!state.loggedIn) {
    return <Redirect to={{ pathname: "/login", state: { from: "/" } }} />;
  } else {
    toRender = (
      <div className="relative w-full h-full">
        <div className="flex flex-col items-center justify-center w-full px-8 h-8/12">
          <img className="w-auto h-20" src="/logo.svg" alt="" />
        </div>
        <div className="w-full px-4 text-lg h-2/12">
          <b className="text-clubred-dark">{props.sender}</b> is asking to
          import your
          <b>scholars addresses.</b>
        </div>
        <div className="w-full px-4 h-2/12">
          <button
            onClick={() => {
              console.log("BTN CLick");
              
              hdWallet.getAccountsAddresses().then((addresses) => {
                console.log("BTN CLick result");
                localStorage.setItem("sync_msgs", JSON.stringify(addresses));
                localStorage.removeItem("sync_msgs");
                window.close();
              });
              console.log("BTN CLick done");
            }}
            className="w-full px-4 py-2 rounded bg-clubred-dark hover:bg-clubred-light "
          >
            Export
          </button>
        </div>
      </div>
    );
  }

  return <>{toRender}</>;
};

export default Main;
