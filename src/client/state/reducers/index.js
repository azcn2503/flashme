import { combineReducers } from "redux";

import cards from "./cards";
import subjects from "./subjects";
import tests from "./tests";
import user from "./user";

export default combineReducers({
  cards,
  subjects,
  tests,
  user
});
