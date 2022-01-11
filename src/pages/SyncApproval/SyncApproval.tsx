import React, { FC, useEffect } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../../index.scss";
import { reduxStore } from "../../reduxStore";
import { BaseLayout } from "../BaseLayout";
import PasswordPage from "../PasswordPage";
import Main from "./components/main";

export const SyncApproval: FC = (props) => {
  const sender = window.location.href.split("?")[1].split("=")[1];

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem("sync_msgs", JSON.stringify(""));
      localStorage.removeItem("sync_msgs");
    };
  }, []);

  return (
    <BrowserRouter basename="/syncApproval.html">
      <Switch>
        <Route
          exact
          path={"/login"}
          render={(props) => {
            return (
              <BaseLayout>
                <PasswordPage />
              </BaseLayout>
            );
          }}
        />
        <Route
          exact
          path={"/"}
          render={(props) => {
            return (
              <BaseLayout>
                <Main sender={sender} />
              </BaseLayout>
            );
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

render(
  <Provider store={reduxStore}>
    <SyncApproval />
  </Provider>,
  document.getElementById("root")
);
