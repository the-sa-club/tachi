import { useReducer } from "react";

// State
interface IState {
  loading: boolean;
  err: string;
  addresses: string[];
  loggedIn: boolean;
  registered: boolean;
}

interface IAction {
  type:
    | "setLoading"
    | "setAddresses"
    | "notRegistered"
    | "authenticated"
    | "notAuthenticated"
    | "setError";
  payload?: any;
}

const initialState: IState = {
  loading: true,
  err: "",
  addresses: [],
  loggedIn: false,
  registered: false,
};

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };

    case "setAddresses":
      return { ...state, loading: false, addresses: action.payload };

    case "notRegistered":
      return {
        ...state,
        loading: false,
        loggedIn: false,
        registered: false,
        addresses: [],
        err: "Please load your account first then try again.",
      };

    case "setError":
      return {
        ...state,

        err: action.payload,
      };

    case "notAuthenticated":
      return {
        ...state,
        loading: false,
        loggedIn: false,
        registered: true,
        addresses: [],
        err: "Please login first then try again.",
      };

    case "authenticated":
      return {
        ...state,
        loading: false,
        loggedIn: true,
        registered: true,
        addresses: action.payload ?? [],
        err: "",
      };

    default:
      return state;
  }
};

function useMyState() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (initialState) => initialState
  );

  return [state, dispatch] as [IState, React.Dispatch<IAction>];
}

export default useMyState;
