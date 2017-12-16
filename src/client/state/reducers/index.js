import { combineReducers } from "redux";

import cards from "./cards";
import subjects from "./subjects";

export default combineReducers({
  cards,
  subjects
});
