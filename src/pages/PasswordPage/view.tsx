import React, { FC, useState } from "react";

interface IProps {
  fresh: boolean;
  onCreatePassword: (password: string) => void;
  onLogin: (password: string) => void;
  passwordErr: boolean;
}

export const View: FC<IProps> = (props) => {
  const [state, setState] = useState({
    password: "",
    passwordConfirmation: "",
    passwordErr: "",
    passwordConfirmationErr: "",
  });

  const onCreate = () => {
    if (!state.password) {
      return setState({
        ...state,
        passwordErr: "You should type your password.",
      });
    }
    if (state.password != state.passwordConfirmation) {
      return setState({
        ...state,
        passwordConfirmationErr: "Does n't match your password.",
      });
    }

    props.onCreatePassword(state.password);
  };

  const onLogin = () => {
    if (!state.password) {
      return setState({
        ...state,
        passwordErr: "You should type your password.",
      });
    }
    props.onLogin(state.password);
  };

  if (props.fresh) {
    return (
      <div className="w-full h-full">
        <div className="flex flex-col items-center justify-center w-full px-8 h-4/6">
          <img className="w-auto h-20" src="/logo.svg" alt="" />
        </div>
        <div className="flex flex-col items-end w-full px-2 py-2 h-2/6">
          <input
            type="password"
            className="w-full px-2 py-2 text-gray-600 border-2 rounded focus:border-clubred-dark focus:outline-none"
            placeholder="Type your password ...."
            value={state.password}
            onChange={(e) =>
              setState({
                ...state,
                password: e.target.value,
                passwordErr: "",
                passwordConfirmationErr: "",
              })
            }
          />
          <span className="w-full mt-1 text-xs text-clubred-dark">
            {state.passwordErr}
          </span>
          <div className="w-full h-2"></div>
          <input
            type="password"
            className="w-full px-2 py-2 text-gray-600 border-2 rounded focus:border-clubred-dark focus:outline-none"
            placeholder="Password confirmation ...."
            value={state.passwordConfirmation}
            onChange={(e) =>
              setState({
                ...state,
                passwordConfirmation: e.target.value,
                passwordErr: "",
                passwordConfirmationErr: "",
              })
            }
          />
          <span className="w-full mt-1 text-xs text-clubred-dark">
            {state.passwordConfirmationErr}
          </span>
          <div className="w-full h-2"></div>
          <button
            onClick={() => {
              onCreate();
            }}
            className="w-full px-4 py-2 rounded bg-clubred-dark hover:bg-clubred-light "
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-center w-full px-8 h-4/6">
        <img className="w-auto h-20" src="/logo.svg" alt="" />
      </div>
      <div className="flex flex-col items-end justify-end w-full px-2 py-2 h-2/6">
        <input
          type="password"
          className="w-full px-2 py-2 text-gray-600 border-2 rounded focus:border-clubred-dark focus:outline-none"
          placeholder="Type your password ...."
          value={state.password}
          onChange={(e) =>
            setState({
              ...state,
              password: e.target.value,
              passwordErr: "",
            })
          }
        />

        <span className="w-full mt-1 text-xs text-clubred-dark">
          {props.passwordErr ? "Password is not correct." : ""}
        </span>
        <div className="w-full h-2"></div>
        <button
          onClick={() => {
            onLogin();
          }}
          className="w-full px-4 py-2 rounded bg-clubred-dark hover:bg-clubred-light "
        >
          LogIn
        </button>
      </div>
    </div>
  );
};
