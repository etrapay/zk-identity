import { combineReducers } from "redux";
import { reducer as mainReducer } from "./main.reducers";

export const rootReducer = combineReducers({
  main: mainReducer,
});
