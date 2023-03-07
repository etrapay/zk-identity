import { ACTION_TYPES } from "../constants/types";

export const toggleLoading = () => {
  return {
    type: ACTION_TYPES.TOGGLE_LOADING,
  };
};
