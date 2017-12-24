import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

import rootReducer from "../../state/reducers";
import App from "../app/app";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class Root extends Component {
  render() {
    return (
      <Provider
        store={createStore(
          rootReducer,
          compose(composeEnhancers(applyMiddleware(thunk)))
        )}
      >
        <BrowserRouter>
          <Route path="/" component={App} />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default Root;
