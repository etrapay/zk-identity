import { ACTION_TYPES } from "../constants/types";

const INITIAL_STATE = {
  loading: false,
};

export const reducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return state;
  }
};
