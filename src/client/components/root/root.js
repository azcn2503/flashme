import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import App from 'client/components/app/app';

class Root extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/" component={App} />
      </BrowserRouter>
    );
  }
}

export default Root;
