import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";

import rootReducer from "../../state/reducers";

import App from "client/components/app/app";

class Root extends Component {
  render() {
    return (
      <Provider
        store={createStore(
          rootReducer,
          compose(
            applyMiddleware(thunk),
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
              window.__REDUX_DEVTOOLS_EXTENSION__()
          )
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
