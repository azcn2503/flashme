import React, { Component } from 'react';

import FlashCard from '../flash-card';

class App extends Component {
  render() {
    return (
      <div>
        <FlashCard
          front="Question"
          back="Answer"
        />
      </div>
    );
  }
}

export default App;
