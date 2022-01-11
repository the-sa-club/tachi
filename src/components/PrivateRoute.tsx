import React, { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import authService from "../services/authService";

interface IPrivateRouteProps extends RouteProps {}
export const PrivateRoute: FC<IPrivateRouteProps> = (props) => {
  console.log("PrivateRoute");

  if (!authService.isAuthenticated()) {
    console.log("Redirect");
    return (
      <Redirect
        to={{ pathname: "/login", state: { from: props.path.toString() } }}
      />
    );
  }

  console.log("[PrivateRoute]", props);

  return <Route {...props} />;
};
