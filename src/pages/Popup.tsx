import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { PrivateRoute } from "../components/PrivateRoute";
import "../index.scss";
import { reduxStore } from "../reduxStore";
import { BaseLayout } from "./BaseLayout";
import HomePage from "./HomePage";
import PasswordPage from "./PasswordPage";
import SeedPage from "./SeedPage";

function Popup() {
  console.log("[Popup]");

  return (
    <BrowserRouter basename="/popup.html">
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

        <PrivateRoute
          exact
          path={"/seed"}
          render={(props) => {
            return (
              <BaseLayout>
                <SeedPage />
              </BaseLayout>
            );
          }}
        />

        <PrivateRoute
          exact
          path={"/"}
          render={(props) => {
            return (
              <BaseLayout>
                <HomePage />
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
    <Popup />
  </Provider>,
  document.getElementById("root")
);
