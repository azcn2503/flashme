import React from "react";
import ReactDOM from "react-dom";

import Root from "./components/root/root";

import startup from "./lib/startup";

import "./index.scss";

startup().then(() =>
  ReactDOM.render(<Root />, document.querySelector("#react-root"))
);
