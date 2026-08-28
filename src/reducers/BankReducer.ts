type State = {
  balance: number;
};

type Action =
  | {
      type: "DEPOSIT";
      amount: number;
    }
  | {
      type: "WITHDRAW";
      amount: number;
    }
  | {
      type: "RESET";
    };

// Define the reducer function
export const bankReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "DEPOSIT":
      return { balance: state.balance + action.amount };
    case "WITHDRAW":
      return { balance: state.balance - action.amount };
    case "RESET":
      return { balance: 0 };
    default:
      return state;
  }
};

// create the initial state
export const initialState: State = { balance: 0 };
