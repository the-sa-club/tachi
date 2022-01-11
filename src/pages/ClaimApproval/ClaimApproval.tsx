import React, { useEffect } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../../index.scss";
import { reduxStore } from "../../reduxStore";
import { BaseLayout } from "../BaseLayout";
import PasswordPage from "../PasswordPage";
import Main from "./components/main";

function ClaimApproval() {
  const rawAddresses = window.location.href.split("?")[1].split("=")[1];
  let addresses = JSON.parse(decodeURIComponent(rawAddresses));
  addresses = JSON.parse(addresses);

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem("claim_msgs", JSON.stringify(""));
      localStorage.removeItem("claim_msgs");
    };
  }, []);

  return (
    <BrowserRouter basename="/claimApproval.html">
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
                <Main addresses={addresses} />
              </BaseLayout>
            );
          }}
        />
      </Switch>
    </BrowserRouter>
  );
}

render(
  <Provider store={reduxStore}>
    <ClaimApproval />
  </Provider>,
  document.getElementById("root")
);
