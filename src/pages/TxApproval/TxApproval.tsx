import React, { useEffect } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "../../index.scss";
import { reduxStore } from "../../reduxStore";
import { BaseLayout } from "../BaseLayout";
import PasswordPage from "../PasswordPage";
import Main from "./components/main";

function TxApproval() {
  const rawPayoutDetails = window.location.href.split("?")[1].split("=")[1];
  let payoutDetails = JSON.parse(decodeURIComponent(rawPayoutDetails));
  payoutDetails = JSON.parse(payoutDetails);

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem("tx_signing_msgs", JSON.stringify(""));
      localStorage.removeItem("tx_signing_msgs");
    };
  }, []);

  return (
    <BrowserRouter basename="/txApproval.html">
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
                <Main payoutDetails={payoutDetails} />
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
    <TxApproval />
  </Provider>,
  document.getElementById("root")
);
