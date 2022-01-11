import React, { Component, FC, useReducer } from "react";
import { Dialog } from "./components/dialog";
import { Loading } from "./components/loading";
import { Toast } from "./components/toast";

export interface IBaseProps {
  setLoading?: (loading: boolean) => void;
  setToast?: (msg: string) => void;
  setDialog?: (
    msg: string,
    onCancel: Function,
    onApprove: Function,
    cancelText?: string,
    approveText?: string
  ) => void;
}

// State
interface IState {
  loading: boolean;
  toast: string;
  dialog: {
    open: boolean;
    msg: string;
    onCancel: Function;
    onApprove: Function;
    approveText: string;
    cancelText: string;
  };
}
interface IAction {
  type: string;
  payload: any;
}

const initialState: IState = {
  loading: false,
  toast: "",
  dialog: {
    open: false,
    msg: "",
    onCancel: null,
    onApprove: null,
    approveText: "",
    cancelText: "",
  },
};

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };

    case "setToast":
      return { ...state, toast: action.payload };

    case "setDialog":
      return { ...state, dialog: action.payload };

    default:
      return state;
  }
};

export const BaseLayout: FC = (props) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (initialState) => initialState
  );

  const setLoading = (loading: boolean) => {
    dispatch({ type: "setLoading", payload: loading });
  };

  const setToast = (msg: string) => {
    dispatch({ type: "setToast", payload: msg });
    setTimeout(() => {
      dispatch({ type: "setToast", payload: "" });
    }, 1000);
  };

  const setDialog = (
    msg: string,
    onCancel: Function,
    onApprove: Function,
    cancelText?: string,
    approveText?: string
  ) => {
    dispatch({
      type: "setDialog",
      payload: {
        msg,
        onCancel: () => {
          onCancel();
          dispatch({
            type: "setDialog",
            payload: { onCancel: null, onApprove: null, open: false, msg: "" },
          });
        },
        onApprove: () => {
          onApprove();
          dispatch({
            type: "setDialog",
            payload: { onCancel: null, onApprove: null, open: false, msg: "" },
          });
        },
        open: true,
        cancelText,
        approveText,
      },
    });
  };

  const childrenExtra = React.Children.map(props.children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        setLoading,
        setToast,
        setDialog,
      });
    }
    return child;
  });

  return (
    <div className="relative w-full h-full overflow-hidden text-white bg-gray-900 font-poppins">
      {childrenExtra}
      <Loading visible={state.loading} />
      <Toast visible={!!state.toast} msg={state.toast} />
      <Dialog
        visible={!!state.dialog.open}
        msg={state.dialog.msg}
        onCancel={state.dialog.onCancel}
        onApprove={state.dialog.onApprove}
        cancelText={state.dialog.cancelText}
        approveText={state.dialog.approveText}
      />
    </div>
  );
};
