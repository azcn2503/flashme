import { combineReducers } from "redux";

import cards from "./cards";
import subjects from "./subjects";
import tests from "./tests";
import user from "./user";
import toasts from "./toasts";
import tooltip from "./tooltip";

export default combineReducers({
  cards,
  subjects,
  tests,
  user,
  toasts,
  tooltip
});
