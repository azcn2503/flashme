import { combineReducers } from "redux";

import cards from "./cards";
import subjects from "./subjects";
import tests from "./tests";
import user from "./user";
import tooltip from "./tooltip";

export default combineReducers({
  cards,
  subjects,
  tests,
  user,
  tooltip
});
